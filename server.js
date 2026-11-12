'use strict';
// Ikan Quests server. No external dependencies (Node 22.13+ with built-in SQLite).
const http = require('node:http'), fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = +process.env.PORT || 3000;
const DATA = process.env.DATA_DIR || '/data';
const ALLOW_REG = (process.env.ALLOW_REGISTRATION || 'false') === 'true';
const PUB = path.join(__dirname, 'public');
const SESSION_MS = 90 * 864e5;

fs.mkdirSync(DATA, { recursive: true });
const db = new DatabaseSync(path.join(DATA, 'ikan.db'));
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT UNIQUE COLLATE NOCASE NOT NULL, salt TEXT NOT NULL, hash TEXT NOT NULL, admin INTEGER NOT NULL DEFAULT 0, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS state(user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, json TEXT NOT NULL, updated INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS guilds(id INTEGER PRIMARY KEY, name TEXT NOT NULL, code TEXT UNIQUE NOT NULL, owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, created INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS guild_members(guild_id INTEGER NOT NULL REFERENCES guilds(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, joined INTEGER NOT NULL, PRIMARY KEY(guild_id,user_id));
CREATE TABLE IF NOT EXISTS completions(id TEXT PRIMARY KEY, guild_id INTEGER NOT NULL REFERENCES guilds(id) ON DELETE CASCADE, board_id TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, title TEXT NOT NULL, bname TEXT NOT NULL, xp INTEGER NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS completions_guild ON completions(guild_id);
CREATE TABLE IF NOT EXISTS boards(id TEXT PRIMARY KEY, guild_id INTEGER NOT NULL REFERENCES guilds(id) ON DELETE CASCADE, owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, json TEXT NOT NULL, updated INTEGER NOT NULL);`);
// Guild options (added later): may members create invite codes / share quest boards? Existing databases get the columns here.
db.exec('CREATE TABLE IF NOT EXISTS activations(board_id TEXT NOT NULL REFERENCES boards(id) ON DELETE CASCADE, quest_id TEXT NOT NULL, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, PRIMARY KEY(board_id,quest_id,user_id))'); // who has a shared quest active
for (const col of ['perm_code INTEGER NOT NULL DEFAULT 0', 'perm_board INTEGER NOT NULL DEFAULT 1', "color TEXT NOT NULL DEFAULT ''", "color2 TEXT NOT NULL DEFAULT ''", "pat TEXT NOT NULL DEFAULT ''", "emoji TEXT NOT NULL DEFAULT ''"]) { try { db.exec('ALTER TABLE guilds ADD COLUMN ' + col); } catch {} }

const q = sql => db.prepare(sql);
const err = (status, message) => Object.assign(new Error(message), { status });
const userCount = () => q('SELECT COUNT(*) c FROM users').get().c;
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex');
const validName = n => typeof n === 'string' && /^[\p{L}\p{N}_.-]{2,32}$/u.test(n);
const validPw = p => typeof p === 'string' && p.length >= 6 && p.length <= 200;

function mkUser(name, pw, admin) {
  if (!validName(name)) throw err(400, 'Name: 2-32 characters (letters, numbers, _ . -)');
  if (!validPw(pw)) throw err(400, 'Password: at least 6 characters');
  if (q('SELECT 1 FROM users WHERE name=?').get(name)) throw err(409, 'That name is already taken');
  const salt = crypto.randomBytes(16).toString('hex');
  return Number(q('INSERT INTO users(name,salt,hash,admin,created) VALUES(?,?,?,?,?)').run(name, salt, hashPw(pw, salt), admin ? 1 : 0, Date.now()).lastInsertRowid);
}
function session(uid) {
  const t = crypto.randomBytes(32).toString('hex');
  q('INSERT INTO sessions VALUES(?,?,?)').run(t, uid, Date.now());
  return t;
}
function auth(req) {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!t) return null;
  const s = q('SELECT u.id,u.name,u.admin,s.created FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=?').get(t);
  if (!s || Date.now() - s.created > SESSION_MS) return null;
  return { id: s.id, name: s.name, admin: !!s.admin, token: t };
}
const needUser = req => auth(req) || (() => { throw err(401, 'Not signed in'); })();
const needAdmin = req => { const u = needUser(req); if (!u.admin) throw err(403, 'Admins only'); return u; };

const fails = new Map();
const tooMany = ip => { const a = (fails.get(ip) || []).filter(t => Date.now() - t < 9e5); fails.set(ip, a); return a.length >= 10; }; // also used for invite-code guessing

const send = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(obj)); };
const body = (req, limit = 5e6) => new Promise((ok, no) => {
  let n = 0; const b = [];
  req.on('data', c => { n += c.length; if (n > limit) { no(err(413, 'Payload too large')); req.destroy(); } else b.push(c); });
  req.on('end', () => { try { ok(b.length ? JSON.parse(Buffer.concat(b)) : {}); } catch { no(err(400, 'Invalid JSON')); } });
});

// ---- Guilds and shared quest boards ----
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no look-alike characters
const newCode = () => { for (;;) { let c = ''; for (let i = 0; i < 8; i++) c += CODE_CHARS[crypto.randomInt(CODE_CHARS.length)]; if (!q('SELECT 1 FROM guilds WHERE code=?').get(c)) return c; } };
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const isMember = (gid, uid) => !!q('SELECT 1 FROM guild_members WHERE guild_id=? AND user_id=?').get(gid, uid);
const needGuild = (gid, uid) => {
  const g = q('SELECT * FROM guilds WHERE id=?').get(gid);
  if (!g) throw err(404, 'Guild not found');
  if (!isMember(gid, uid)) throw err(403, 'You are not a member of this guild');
  return g;
};
const guildView = (g, uid) => ({
  id: g.id, name: g.name, code: g.code, owner_id: g.owner_id, xp: q('SELECT COALESCE(SUM(xp),0) x FROM completions WHERE guild_id=?').get(g.id).x,
  members: q('SELECT u.id,u.name FROM guild_members m JOIN users u ON u.id=m.user_id WHERE m.guild_id=? ORDER BY m.joined,u.id').all(g.id),
  mine: g.owner_id === uid,
  color: g.color || '', color2: g.color2 || '', pat: g.pat || '', emoji: g.emoji || '',
  perm_code: !!g.perm_code, perm_board: !!g.perm_board, can_code: g.owner_id === uid || !!g.perm_code, can_board: g.owner_id === uid || !!g.perm_board,
});
const str = (v, n) => (typeof v === 'string' ? v.slice(0, n) : '');
const num = v => (Number.isFinite(v) ? v : 0);
// Keeps only the expected fields of a shared board. Personal fields (active flag, xp) never reach the server.
function cleanBoard(b) {
  if (!b || typeof b !== 'object') throw err(400, 'Invalid board');
  const quests = (Array.isArray(b.quests) ? b.quests : []).slice(0, 500).filter(x => x && typeof x === 'object' && typeof x.id === 'string' && x.id.length <= 40)
    .map(x => { const { active, ...r } = x; r.u = num(r.u); return r; });
  const del = {}; let n = 0;
  if (b.del && typeof b.del === 'object') for (const [k, v] of Object.entries(b.del)) if (k.length <= 40 && Number.isFinite(v) && n++ < 3000) del[k] = v;
  return { name: str(b.name, 30) || 'Board', color: str(b.color, 20), color2: str(b.color2, 20), pat: str(b.pat, 6), emoji: str(b.emoji, 16), u: num(b.u), del, quests };
}
// Merge two versions of a board: the newer meta wins; quests are merged one by one (newer 'u' wins); deletions are tombstones.
function mergeBoard(a, b) {
  const meta = b.u > a.u ? b : a, del = { ...a.del };
  for (const [k, v] of Object.entries(b.del)) del[k] = Math.max(del[k] || 0, v);
  const map = new Map(a.quests.map(x => [x.id, x]));
  for (const x of b.quests) { const o = map.get(x.id); if (!o || x.u > o.u) map.set(x.id, x); }
  const cut = Date.now() - 30 * 864e5;
  for (const k of Object.keys(del)) if (del[k] < cut) delete del[k];
  const quests = [...map.values()].filter(x => !(del[x.id] >= x.u));
  return { name: meta.name, color: meta.color, color2: meta.color2, pat: meta.pat, emoji: meta.emoji, u: Math.max(a.u, b.u), del, quests };
}
const actsOf = r => { // quest id -> names of the members who activated it
  const out = {};
  for (const x of q('SELECT a.quest_id qid,u.name n FROM activations a JOIN users u ON u.id=a.user_id JOIN guild_members m ON m.user_id=a.user_id AND m.guild_id=? WHERE a.board_id=? ORDER BY a.rowid').all(r.guild_id, r.id)) (out[x.qid] = out[x.qid] || []).push(x.n);
  return out;
};
const boardRow = r => ({ id: r.id, guild_id: r.guild_id, acts: actsOf(r), owner_id: r.owner_id, board: JSON.parse(r.json), updated: r.updated, xp: q('SELECT COALESCE(SUM(xp),0) x FROM completions WHERE board_id=?').get(r.id).x });
const needBoard = (id, uid) => {
  const r = q('SELECT * FROM boards WHERE id=?').get(id);
  if (!r || !isMember(r.guild_id, uid)) throw err(404, 'Board not found');
  return r;
};
const validGuildName = n => typeof n === 'string' && n.trim().length >= 2 && n.trim().length <= 40;

async function api(req, res, url) {
  const m = req.method, p = url.pathname, ip = req.socket.remoteAddress;
  if (p === '/api/health') return send(res, 200, { ok: true });
  if (p === '/api/status') return send(res, 200, { setup: userCount() === 0, registration: ALLOW_REG });

  if (p === '/api/register' && m === 'POST') {
    const b = await body(req), first = userCount() === 0;
    if (!first && !ALLOW_REG) throw err(403, 'Registration is disabled. Ask the admin for an account.');
    const id = mkUser(b.name, b.password, first);
    return send(res, 200, { token: session(id) });
  }
  if (p === '/api/login' && m === 'POST') {
    if (tooMany(ip)) throw err(429, 'Too many attempts. Please wait 15 minutes.');
    const b = await body(req), u = q('SELECT * FROM users WHERE name=?').get(String(b.name || ''));
    const ok = u && typeof b.password === 'string' && crypto.timingSafeEqual(Buffer.from(hashPw(b.password, u.salt)), Buffer.from(u.hash));
    if (!ok) { fails.get(ip).push(Date.now()); throw err(401, 'Wrong name or password'); }
    return send(res, 200, { token: session(u.id) });
  }
  if (p === '/api/logout' && m === 'POST') { q('DELETE FROM sessions WHERE token=?').run(needUser(req).token); return send(res, 200, {}); }
  if (p === '/api/me' && m === 'GET') { const u = needUser(req); return send(res, 200, { id: u.id, name: u.name, admin: u.admin }); }
  if (p === '/api/me/password' && m === 'POST') {
    const u = needUser(req), b = await body(req), r = q('SELECT * FROM users WHERE id=?').get(u.id);
    if (!validPw(b.password)) throw err(400, 'Password: at least 6 characters');
    if (typeof b.current !== 'string' || !crypto.timingSafeEqual(Buffer.from(hashPw(b.current, r.salt)), Buffer.from(r.hash))) throw err(401, 'Current password is wrong');
    const salt = crypto.randomBytes(16).toString('hex');
    q('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt, hashPw(b.password, salt), u.id);
    return send(res, 200, {});
  }

  if (p === '/api/state' && m === 'GET') {
    const u = needUser(req), r = q('SELECT json,updated FROM state WHERE user_id=?').get(u.id);
    return send(res, 200, r ? { state: JSON.parse(r.json), updated: r.updated } : { state: null, updated: 0 });
  }
  if (p === '/api/state' && m === 'PUT') {
    const u = needUser(req), b = await body(req);
    if (!b.state || typeof b.state !== 'object') throw err(400, 'Missing state');
    const now = Date.now();
    q('INSERT INTO state(user_id,json,updated) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET json=excluded.json,updated=excluded.updated').run(u.id, JSON.stringify(b.state), now);
    return send(res, 200, { updated: now });
  }

  // ---- guilds ----
  if (p === '/api/guilds' && m === 'GET') {
    const u = needUser(req);
    return send(res, 200, { guilds: q('SELECT g.* FROM guilds g JOIN guild_members m ON m.guild_id=g.id WHERE m.user_id=? ORDER BY g.id').all(u.id).map(g => guildView(g, u.id)) });
  }
  if (p === '/api/guilds' && m === 'POST') {
    const u = needUser(req), b = await body(req);
    if (!validGuildName(b.name)) throw err(400, 'Guild name: 2-40 characters');
    if (q('SELECT COUNT(*) c FROM guilds WHERE owner_id=?').get(u.id).c >= 20) throw err(400, 'Too many guilds');
    const gid = Number(q('INSERT INTO guilds(name,code,owner_id,created) VALUES(?,?,?,?)').run(b.name.trim(), newCode(), u.id, Date.now()).lastInsertRowid);
    q('INSERT INTO guild_members VALUES(?,?,?)').run(gid, u.id, Date.now());
    return send(res, 200, { guild: guildView(q('SELECT * FROM guilds WHERE id=?').get(gid), u.id) });
  }
  if (p === '/api/guilds/join' && m === 'POST') {
    const u = needUser(req);
    if (tooMany('join:' + u.id)) throw err(429, 'Too many attempts. Please wait 15 minutes.');
    const b = await body(req), g = q('SELECT * FROM guilds WHERE code=?').get(normCode(b.code));
    if (!g) { fails.get('join:' + u.id).push(Date.now()); throw err(404, 'Invalid invite code'); }
    q('INSERT OR IGNORE INTO guild_members VALUES(?,?,?)').run(g.id, u.id, Date.now());
    return send(res, 200, { guild: guildView(g, u.id) });
  }

  const sm = p.match(/^\/api\/guilds\/(\d+)\/(stats|completions)$/);
  if (sm && m === 'GET') {
    const u = needUser(req), gid = +sm[1]; needGuild(gid, u.id);
    if (sm[2] === 'stats') {
      const rows = q('SELECT user_id,COUNT(*) c,SUM(xp) x FROM completions WHERE guild_id=? GROUP BY user_id').all(gid), by = new Map(rows.map(r => [r.user_id, r]));
      const members = q('SELECT u.id,u.name FROM guild_members m JOIN users u ON u.id=m.user_id WHERE m.guild_id=?').all(gid)
        .map(x => ({ id: x.id, name: x.name, count: (by.get(x.id) || {}).c || 0, xp: (by.get(x.id) || {}).x || 0 }));
      const total = rows.reduce((a, r) => a + r.x, 0); // XP of former members still counts for the guild
      members.sort((a, b) => b.xp - a.xp || b.count - a.count || a.name.localeCompare(b.name));
      return send(res, 200, { xp: total, members: members.map(x => ({ ...x, share: total ? x.xp / total : 0 })) });
    }
    const up = url.searchParams.get('user'); // one member, or the whole guild when omitted
    const rows = up ? q('SELECT c.id,c.title,c.bname,c.ts,u.name FROM completions c JOIN users u ON u.id=c.user_id WHERE c.guild_id=? AND c.user_id=? ORDER BY c.ts DESC LIMIT 500').all(gid, +up)
      : q('SELECT c.id,c.title,c.bname,c.ts,u.name FROM completions c JOIN users u ON u.id=c.user_id WHERE c.guild_id=? ORDER BY c.ts DESC LIMIT 500').all(gid);
    return send(res, 200, { items: rows.map(r => ({ id: r.id.split(':').slice(1).join(':'), title: r.title, bname: r.bname, ts: r.ts, user: r.name })) });
  }
  const gm = p.match(/^\/api\/guilds\/(\d+)(?:\/(leave|kick|code|settings|style))?$/);
  if (gm) {
    const u = needUser(req), gid = +gm[1], g = needGuild(gid, u.id), act = gm[2];
    if (!act && m === 'DELETE') {
      if (g.owner_id !== u.id) throw err(403, 'Only the guild owner can do this');
      q('DELETE FROM guilds WHERE id=?').run(gid);
      return send(res, 200, {});
    }
    if (act === 'leave' && m === 'POST') {
      q('DELETE FROM guild_members WHERE guild_id=? AND user_id=?').run(gid, u.id);
      if (g.owner_id === u.id) { // hand the guild to the longest-standing member, or remove it when nobody is left
        const next = q('SELECT user_id FROM guild_members WHERE guild_id=? ORDER BY joined LIMIT 1').get(gid);
        if (next) q('UPDATE guilds SET owner_id=? WHERE id=?').run(next.user_id, gid); else q('DELETE FROM guilds WHERE id=?').run(gid);
      }
      return send(res, 200, {});
    }
    if (act === 'kick' && m === 'POST') {
      if (g.owner_id !== u.id) throw err(403, 'Only the guild owner can do this');
      const b = await body(req);
      if (+b.user_id === u.id) throw err(400, 'You cannot remove yourself');
      q('DELETE FROM guild_members WHERE guild_id=? AND user_id=?').run(gid, +b.user_id);
      return send(res, 200, {});
    }
    if (act === 'style' && m === 'POST') { // rename and customize the guild (owner only)
      if (g.owner_id !== u.id) throw err(403, 'Only the guild owner can do this');
      const b = await body(req);
      if (!validGuildName(b.name)) throw err(400, 'Guild name: 2-40 characters');
      q('UPDATE guilds SET name=?,color=?,color2=?,pat=?,emoji=? WHERE id=?').run(b.name.trim(), str(b.color, 20), str(b.color2, 20), str(b.pat, 6), str(b.emoji, 16), gid);
      return send(res, 200, { guild: guildView(q('SELECT * FROM guilds WHERE id=?').get(gid), u.id) });
    }
    if (act === 'settings' && m === 'POST') {
      if (g.owner_id !== u.id) throw err(403, 'Only the guild owner can do this');
      const b = await body(req);
      q('UPDATE guilds SET perm_code=?,perm_board=? WHERE id=?').run(b.perm_code ? 1 : 0, b.perm_board ? 1 : 0, gid);
      return send(res, 200, { guild: guildView(q('SELECT * FROM guilds WHERE id=?').get(gid), u.id) });
    }
    if (act === 'code' && m === 'POST') {
      if (g.owner_id !== u.id && !g.perm_code) throw err(403, 'Only the guild owner can do this');
      q('UPDATE guilds SET code=? WHERE id=?').run(newCode(), gid);
      return send(res, 200, { guild: guildView(q('SELECT * FROM guilds WHERE id=?').get(gid), u.id) });
    }
  }

  // ---- shared XP: every finished quest on a shared board is a row in the ledger (board XP, guild XP, leaderboard) ----
  const cm = p.match(/^\/api\/boards\/([0-9a-f-]{36})\/complete$/);
  if (cm && m === 'POST') {
    const u = needUser(req), r = needBoard(cm[1], u.id), b = await body(req);
    const xp = Math.round(+b.xp);
    if (typeof b.id !== 'string' || !b.id || b.id.length > 40) throw err(400, 'Invalid request');
    if (!(xp >= 1 && xp <= 200)) throw err(400, 'Invalid request');
    if (typeof b.quest === 'string' && b.quest.length <= 40) q('DELETE FROM activations WHERE board_id=? AND quest_id=?').run(r.id, b.quest); // a finished quest is no longer active
    q('INSERT OR IGNORE INTO completions VALUES(?,?,?,?,?,?,?,?)').run(u.id + ':' + b.id, r.guild_id, r.id, u.id, str(b.title, 200), str(b.bname, 60), xp, Number.isFinite(+b.ts) ? +b.ts : Date.now());
    return send(res, 200, { xp: q('SELECT COALESCE(SUM(xp),0) x FROM completions WHERE board_id=?').get(r.id).x });
  }
  const am = p.match(/^\/api\/boards\/([0-9a-f-]{36})\/activate$/);
  if (am && m === 'POST') {
    const u = needUser(req), r = needBoard(am[1], u.id), b = await body(req);
    if (typeof b.quest !== 'string' || !b.quest || b.quest.length > 40) throw err(400, 'Invalid request');
    if (b.on) q('INSERT OR IGNORE INTO activations VALUES(?,?,?)').run(r.id, b.quest, u.id); else q('DELETE FROM activations WHERE board_id=? AND quest_id=? AND user_id=?').run(r.id, b.quest, u.id);
    return send(res, 200, { acts: actsOf(r) });
  }
  const dm = p.match(/^\/api\/completions\/([^/]{1,40})$/);
  if (dm && m === 'DELETE') { // undo: only your own entries
    const u = needUser(req);
    q('DELETE FROM completions WHERE id=? AND user_id=?').run(u.id + ':' + dm[1], u.id);
    return send(res, 200, {});
  }

  // ---- shared quest boards ----
  if (p === '/api/boards' && m === 'GET') {
    const u = needUser(req);
    return send(res, 200, { boards: q('SELECT b.* FROM boards b JOIN guild_members m ON m.guild_id=b.guild_id WHERE m.user_id=?').all(u.id).map(boardRow) });
  }
  if (p === '/api/boards' && m === 'POST') {
    const u = needUser(req), b = await body(req);
    const gg = needGuild(+b.guild_id, u.id);
    if (gg.owner_id !== u.id && !gg.perm_board) throw err(403, 'Only the guild owner can do this');
    const id = crypto.randomUUID(), now = Date.now(), board = cleanBoard(b.board);
    board.u = Math.max(board.u, now);
    q('INSERT INTO boards VALUES(?,?,?,?,?)').run(id, +b.guild_id, u.id, JSON.stringify(board), now);
    return send(res, 200, boardRow(q('SELECT * FROM boards WHERE id=?').get(id)));
  }
  const bm = p.match(/^\/api\/boards\/([0-9a-f-]{36})$/);
  if (bm) {
    const u = needUser(req), r = needBoard(bm[1], u.id);
    if (m === 'PUT') {
      const b = await body(req, 2e6), merged = mergeBoard(JSON.parse(r.json), cleanBoard(b.board)), now = Date.now();
      q('UPDATE boards SET json=?,updated=? WHERE id=?').run(JSON.stringify(merged), now, r.id);
      return send(res, 200, boardRow(q('SELECT * FROM boards WHERE id=?').get(r.id)));
    }
    if (m === 'DELETE') {
      const g = q('SELECT owner_id FROM guilds WHERE id=?').get(r.guild_id);
      if (r.owner_id !== u.id && g.owner_id !== u.id) throw err(403, 'Only the guild owner can do this');
      q('DELETE FROM boards WHERE id=?').run(r.id);
      return send(res, 200, {});
    }
  }

  if (p === '/api/users' && m === 'GET') { needAdmin(req); return send(res, 200, { users: q('SELECT id,name,admin FROM users ORDER BY id').all().map(u => ({ ...u, admin: !!u.admin })) }); }
  if (p === '/api/users' && m === 'POST') { needAdmin(req); const b = await body(req); mkUser(b.name, b.password, false); return send(res, 200, {}); }
  const um = p.match(/^\/api\/users\/(\d+)(\/password)?$/);
  if (um) {
    const me = needAdmin(req), id = +um[1];
    if (um[2] && m === 'POST') {
      const b = await body(req); if (!validPw(b.password)) throw err(400, 'Password: at least 6 characters');
      const salt = crypto.randomBytes(16).toString('hex');
      q('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt, hashPw(b.password, salt), id);
      q('DELETE FROM sessions WHERE user_id=?').run(id);
      return send(res, 200, {});
    }
    if (!um[2] && m === 'DELETE') {
      if (id === me.id) throw err(400, 'You cannot delete yourself');
      q('DELETE FROM users WHERE id=?').run(id);
      return send(res, 200, {});
    }
  }
  throw err(404, 'Not found');
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
function serveStatic(req, res, url) {
  let f = path.normalize(path.join(PUB, url.pathname === '/' ? 'index.html' : url.pathname));
  if (!f.startsWith(PUB) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(PUB, 'index.html');
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
  fs.createReadStream(f).pipe(res);
}

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/')) await api(req, res, url); else serveStatic(req, res, url);
  } catch (e) {
    if (!e.status) console.error(e);
    send(res, e.status || 500, { error: e.status ? e.message : 'Server error' });
  }
}).listen(PORT, '0.0.0.0', () => console.log(`Ikan Quests listening on port ${PORT} (data: ${DATA})`));
