// Android app only (Capacitor): hands the session, reminder settings and translated texts to the native
// widget and daily reminders (IkanNativePlugin), and adds a "Notifications" screen to the account menu.
// In a normal browser this file does nothing.
(() => {
  // The page is loaded from the server, so only Capacitor's injected bridge is present (no @capacitor/core):
  // it may lack isNativePlatform()/getPlatform(), so detect the Android bridge and use whichever call path exists.
  const C = window.Capacitor;
  const android = !!window.androidBridge || (!!C && ((typeof C.getPlatform === 'function' && C.getPlatform() === 'android') ||
    (typeof C.isNativePlatform === 'function' && C.isNativePlatform())));
  const callable = !!C && (typeof C.nativePromise === 'function' || typeof C.toNative === 'function' || !!(C.Plugins && C.Plugins.IkanNative));
  if (!android || !callable) return;
  const call = (m, o) => {
    o = o || {};
    if (C.Plugins && C.Plugins.IkanNative && typeof C.Plugins.IkanNative[m] === 'function') return C.Plugins.IkanNative[m](o);
    if (typeof C.nativePromise === 'function') return C.nativePromise('IkanNative', m, o);
    return new Promise((resolve, reject) => C.toNative('IkanNative', m, o, { resolve, reject }));
  };

  Object.assign(DE, {
    'Notifications': 'Benachrichtigungen',
    'Reminders on this phone': 'Erinnerungen auf diesem Handy',
    'Deadlines (the day before and on the day)': 'Deadlines (am Vortag und am Tag selbst)',
    'Automatically activated quests': 'Automatisch aktivierte Quests',
    'Daily summary': 'Tägliche Zusammenfassung',
    'Overdue quests (every day)': 'Überfällige Quests (täglich)',
    'Time': 'Uhrzeit',
    'Send test notification': 'Test-Benachrichtigung senden',
    'Notifications are blocked for Ikan Quests in the Android settings.': 'Benachrichtigungen sind für Ikan Quests in den Android-Einstellungen blockiert.',
    'Saved.': 'Gespeichert.',
    'Widget: long-press the home screen, choose Widgets, then Ikan Quests.': 'Widget: Startbildschirm lange drücken, Widgets wählen, dann Ikan Quests.',
    'Active quests': 'Aktive Quests',
    'No active quests. Pick new ones or relax a little.': 'Keine aktiven Quests. Wähle neue aus oder entspann ein wenig.',
    'Open Ikan Quests and sign in.': 'Öffne Ikan Quests und melde dich an.',
    'Mark as done': 'Als erledigt markieren',
    'Quest complete! +{xp} XP': 'Quest geschafft! +{xp} XP',
    'Could not complete the quest. Is Tailscale on?': 'Quest konnte nicht erledigt werden. Ist Tailscale an?',
    'today': 'heute', 'tomorrow': 'morgen', 'overdue': 'überfällig',
    'Quest reminders': 'Quest-Erinnerungen',
    'Deadlines, overdue and newly activated quests': 'Deadlines, überfällige und neu aktivierte Quests',
    'Due today': 'Heute fällig', 'Due tomorrow': 'Morgen fällig', 'Overdue': 'Überfällig', 'Quest activated': 'Quest aktiviert',
    '{n} active quests': '{n} aktive Quests', 'Most urgent: {t}': 'Am dringendsten: {t}',
    'Notifications work. Your daily reminder comes at {time}.': 'Benachrichtigungen funktionieren. Deine tägliche Erinnerung kommt um {time} Uhr.',
    'Persistent notification with your active quests (also on the lock screen)': 'Dauerhafte Benachrichtigung mit deinen aktiven Quests (auch auf dem Sperrbildschirm)',
    'Active quests (persistent)': 'Aktive Quests (dauerhaft)',
    'Shows your active quests on the lock screen': 'Zeigt deine aktiven Quests auf dem Sperrbildschirm',
    '{i} of {n} active quests': '{i} von {n} aktiven Quests', 'Back': 'Zurück', 'Done': 'Erledigt', 'Next': 'Weiter',
    'Server not reachable. Is Tailscale on?': 'Server nicht erreichbar. Ist Tailscale an?',
    'Status': 'Status', 'checking…': 'wird geprüft…',
    'Widget: {n} active quests loaded, last update {time}': 'Widget: {n} aktive Quests geladen, zuletzt aktualisiert {time}',
    'Not signed in on the native side yet.': 'Auf Android-Seite noch nicht angemeldet.',
    'Error': 'Fehler'
  });

  const KEY = 'ikan-notif', DEF = { on: true, deadline: true, auto: true, daily: true, overdue: true, time: '08:00', ongoing: true };
  const load = () => { try { return Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return Object.assign({}, DEF); } };
  const store = v => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  // Native code fills in {xp}, {n}, {t}, {time}; t() leaves unknown placeholders as they are.
  const texts = () => ({
    widgetTitle: t('Active quests'), widgetEmpty: t('No active quests. Pick new ones or relax a little.'),
    widgetSignIn: t('Open Ikan Quests and sign in.'), markDone: t('Mark as done'),
    doneToast: t('Quest complete! +{xp} XP'), failToast: t('Could not complete the quest. Is Tailscale on?'),
    today: t('today'), tomorrow: t('tomorrow'), overdueShort: t('overdue'),
    channel: t('Quest reminders'), channelDesc: t('Deadlines, overdue and newly activated quests'),
    nDueToday: t('Due today'), nDueTomorrow: t('Due tomorrow'), nOverdue: t('Overdue'), nActivated: t('Quest activated'),
    nSummary: t('{n} active quests'), nSummaryTop: t('Most urgent: {t}'),
    nTestTitle: 'Ikan Quests', nTestText: t('Notifications work. Your daily reminder comes at {time}.'),
    widgetOffline: t('Server not reachable. Is Tailscale on?'),
    ongoingChannel: t('Active quests (persistent)'), ongoingChannelDesc: t('Shows your active quests on the lock screen'),
    ongoingCount: t('{i} of {n} active quests'), ongoingPrev: t('Back'), ongoingDone: t('Done'), ongoingNext: t('Next')
  });
  const payload = () => {
    let token = ''; try { token = localStorage.getItem('ikan-token') || ''; } catch (e) {}
    return { server: location.origin, token, locale: typeof LOC === 'function' ? LOC() : 'en-GB', settings: load(), tr: texts() };
  };

  let last = '', timer = 0;
  function push(refresh) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const p = payload(), k = JSON.stringify(p);
      if (k !== last) { last = k; call('configure', p).catch(() => { last = ''; }); }
      else if (refresh) call('refresh').catch(() => {});
    }, refresh ? 1500 : 0); // after a save the server has the new state ~0.4 s later
  }
  const write = Store.write; // sync.js has replaced it with the server version by now
  Store.write = s => { write(s); push(true); };
  document.addEventListener('visibilitychange', () => { if (document.hidden) push(true); });
  setInterval(() => push(false), 5000); // sign-in, sign-out and language changes
  push(false);

  // Ask for the Android 13+ notification permission once, after the first sign-in.
  const askOnce = setInterval(() => {
    if (!window.IkanAccount) return;
    clearInterval(askOnce);
    let asked = false; try { asked = !!localStorage.getItem('ikan-notif-asked'); localStorage.setItem('ikan-notif-asked', '1'); } catch (e) {}
    if (!asked && (load().on || load().ongoing)) call('requestPermission').catch(() => {});
  }, 2000);

  const ck = (k, label, on, off) => `<label class="ck${off ? ' off' : ''}" style="margin-top:12px"><input type="checkbox" style="flex:none" data-nk="${k}" ${on ? 'checked' : ''} ${off ? 'disabled' : ''}> ${label}</label>`;
  function open(msg) {
    const s = load(), off = !s.on;
    modal(`<h3>🔔 ${t('Notifications')}</h3>
      ${ck('ongoing', `<b>${t('Persistent notification with your active quests (also on the lock screen)')}</b>`, s.ongoing, false)}
      ${ck('on', `<b>${t('Reminders on this phone')}</b>`, s.on, false)}
      <div style="padding-inline-start:12px">
        ${ck('deadline', t('Deadlines (the day before and on the day)'), s.deadline, off)}
        ${ck('overdue', t('Overdue quests (every day)'), s.overdue, off)}
        ${ck('auto', t('Automatically activated quests'), s.auto, off)}
        ${ck('daily', t('Daily summary'), s.daily, off)}
        <label class="l" for="ntime">${t('Time')}</label>
        <input type="time" id="ntime" value="${s.time}" ${off ? 'disabled' : ''} style="width:auto;font:inherit;font-weight:800;color:var(--ink);background:var(--bg);border:2px solid var(--line);border-radius:12px;padding:8px 10px">
      </div>
      <p class="hint" id="nmsg" style="margin:14px 0 0">${msg || ''}</p>
      <p class="hint" style="margin:8px 0 0">${t('Widget: long-press the home screen, choose Widgets, then Ikan Quests.')}</p>
      <p class="hint" id="nstat" style="margin:8px 0 0">${t('Status')}: ${t('checking…')}</p>
      <div class="foot" style="flex-wrap:wrap"><button class="btn sec" data-s="acct">${t('Back')}</button><button class="btn sec" data-nt="test" ${off ? 'disabled' : ''}>${t('Send test notification')}</button></div>`);
    showStatus();
  }
  // What the native side sees: helps when the widget stays empty.
  async function showStatus() {
    const r = await call('status').catch(e => ({ lastError: String(e && e.message || e) }));
    const el = document.getElementById('nstat'); if (!el) return;
    const time = r.lastSync ? new Date(r.lastSync).toLocaleTimeString(typeof LOC === 'function' ? LOC() : undefined, { hour: '2-digit', minute: '2-digit' }) : '–';
    let txt = r.signedIn === false ? t('Not signed in on the native side yet.') : t('Widget: {n} active quests loaded, last update {time}', { n: r.items ?? '?', time });
    if (r.lastError) txt += ` · ${t('Error')}: ${r.lastError}`;
    el.textContent = `${t('Status')}: ${txt}`;
  }
  function save() {
    const s = load();
    document.querySelectorAll('[data-nk]').forEach(i => { s[i.dataset.nk] = i.checked; });
    const tm = document.getElementById('ntime'); if (tm && /^\d\d:\d\d$/.test(tm.value)) s.time = tm.value;
    store(s); push(false);
    return s;
  }
  const blocked = r => r && r.granted === false ? t('Notifications are blocked for Ikan Quests in the Android settings.') : '';
  document.addEventListener('change', async e => {
    if (!e.target.closest || !e.target.closest('[data-nk], #ntime')) return;
    const s = save();
    let r = null;
    if ((e.target.dataset.nk === 'on' && s.on) || (e.target.dataset.nk === 'ongoing' && s.ongoing)) r = await call('requestPermission').catch(() => null);
    open(blocked(r) || t('Saved.'));
  });
  document.addEventListener('click', async e => {
    const el = e.target.closest('[data-nt]'); if (!el) return;
    if (el.dataset.nt === 'open') open();
    else if (el.dataset.nt === 'test') {
      save();
      let r = await call('requestPermission').catch(() => null);
      if (!r || r.granted) r = await call('test').catch(() => null);
      const m = document.getElementById('nmsg'); if (m) m.textContent = blocked(r);
    }
  });
  window.IkanNotif = { open };
})();
