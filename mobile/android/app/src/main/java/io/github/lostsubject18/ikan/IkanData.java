package io.github.lostsubject18.ikan;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/**
 * Shared native data layer for the widget and the reminders.
 * The web app hands over server, token, settings and translated texts (IkanNativePlugin.configure);
 * quests are always read from the server (/api/state), with the last copy cached for offline use.
 */
final class IkanData {
    private static final String PREFS = "ikan_native";
    private static final Object LOCK = new Object();

    private IkanData() {}

    static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    // ---------- configuration from the web app ----------

    static JSONObject config(Context c) {
        try { return new JSONObject(prefs(c).getString("config", "{}")); } catch (JSONException e) { return new JSONObject(); }
    }

    static void saveConfig(Context c, JSONObject cfg) {
        prefs(c).edit().putString("config", cfg.toString()).apply();
    }

    static boolean signedIn(Context c) {
        JSONObject cfg = config(c);
        return cfg.optString("token").length() > 0 && cfg.optString("server").length() > 0;
    }

    /** Translated text with {placeholders}; falls back to the English default. */
    static String tr(Context c, String key, String fallback, String... kv) {
        String s = config(c).optJSONObject("tr") != null ? config(c).optJSONObject("tr").optString(key, fallback) : fallback;
        for (int i = 0; i + 1 < kv.length; i += 2) s = s.replace("{" + kv[i] + "}", kv[i + 1]);
        return s;
    }

    static JSONObject settings(Context c) {
        JSONObject s = config(c).optJSONObject("settings");
        return s != null ? s : new JSONObject();
    }

    // ---------- HTTP ----------

    private static JSONObject http(Context c, String method, String path, JSONObject body) throws Exception {
        JSONObject cfg = config(c);
        String server = cfg.optString("server"), token = cfg.optString("token");
        if (server.isEmpty() || token.isEmpty()) throw new IllegalStateException("not signed in");
        HttpURLConnection con = (HttpURLConnection) new URL(server + path).openConnection();
        con.setConnectTimeout(6000);
        con.setReadTimeout(8000);
        con.setRequestMethod(method);
        con.setRequestProperty("Authorization", "Bearer " + token);
        con.setRequestProperty("Accept", "application/json");
        if (body != null) {
            con.setDoOutput(true);
            con.setRequestProperty("Content-Type", "application/json");
            try (OutputStream os = con.getOutputStream()) { os.write(body.toString().getBytes(StandardCharsets.UTF_8)); }
        }
        int code = con.getResponseCode();
        InputStream in = code < 400 ? con.getInputStream() : con.getErrorStream();
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        if (in != null) { byte[] b = new byte[8192]; int n; while ((n = in.read(b)) > 0) buf.write(b, 0, n); in.close(); }
        con.disconnect();
        if (code >= 400) throw new IllegalStateException("HTTP " + code);
        String txt = buf.toString("UTF-8");
        return txt.isEmpty() ? new JSONObject() : new JSONObject(txt);
    }

    // ---------- state ----------

    /** Fetches the user's state from the server and caches it. Returns the cached copy if the server is unreachable. */
    static JSONObject loadState(Context c, boolean network) {
        if (network && signedIn(c)) {
            try {
                JSONObject st = http(c, "GET", "/api/state", null).optJSONObject("state");
                if (st != null) {
                    prefs(c).edit().putString("state", st.toString()).putLong("lastSync", System.currentTimeMillis()).remove("lastError").apply();
                    return st;
                }
                prefs(c).edit().putString("lastError", "no state").apply();
            } catch (Exception e) {
                prefs(c).edit().putString("lastError", e.getClass().getSimpleName() + ": " + e.getMessage()).apply();
            }
        }
        try { return new JSONObject(prefs(c).getString("state", "{}")); } catch (JSONException e) { return new JSONObject(); }
    }

    static void clearState(Context c) {
        prefs(c).edit().remove("state").remove("hidden").remove("lastSync").remove("lastError").apply();
    }

    static String lastError(Context c) { return prefs(c).getString("lastError", ""); }

    static boolean hasState(Context c) { return prefs(c).contains("state"); }

    /** One active quest as the widget and reminders see it. */
    static final class Item {
        String cat, quest, title, board, color, due;
        int stepsDone, stepsTotal;
        long activatesOn; // start of the day the auto-activation rule fires, 0 if none
        boolean active;   // shown as active (flagged, or its auto-activation day has come)
        boolean flagged;  // marked active in the saved state
    }

    static long today() {
        Calendar k = Calendar.getInstance();
        k.set(Calendar.HOUR_OF_DAY, 0); k.set(Calendar.MINUTE, 0); k.set(Calendar.SECOND, 0); k.set(Calendar.MILLISECOND, 0);
        return k.getTimeInMillis();
    }

    /** Midnight n calendar days later (safe across daylight-saving changes). */
    static long plusDays(long midnight, int n) {
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(midnight);
        k.add(Calendar.DAY_OF_MONTH, n);
        return k.getTimeInMillis();
    }

    /** "2026-11-12" -> local midnight, or -1. */
    static long day(String iso) {
        if (iso == null || iso.length() < 10) return -1;
        try {
            Calendar k = Calendar.getInstance();
            k.clear();
            k.set(Integer.parseInt(iso.substring(0, 4)), Integer.parseInt(iso.substring(5, 7)) - 1, Integer.parseInt(iso.substring(8, 10)));
            return k.getTimeInMillis();
        } catch (Exception e) { return -1; }
    }

    /** Same rule as autoAct() in the web app: deadline minus n days / weeks / months. */
    static long activationDay(JSONObject q) {
        if (!q.optBoolean("auto") || q.optString("due").isEmpty()) return 0;
        long d = day(q.optString("due"));
        if (d < 0) return 0;
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(d);
        int n = q.optInt("an", 1), u = q.optInt("au", 0);
        if (u == 0) k.add(Calendar.DAY_OF_MONTH, -n); else if (u == 1) k.add(Calendar.DAY_OF_MONTH, -7 * n); else k.add(Calendar.MONTH, -n);
        return k.getTimeInMillis();
    }

    /** Active quests (including ones whose auto-activation day has come), most urgent first. */
    static List<Item> items(JSONObject state, boolean includeUpcoming) {
        List<Item> out = new ArrayList<>();
        JSONArray cats = state.optJSONArray("cats");
        if (cats == null) return out;
        long today = today();
        JSONObject hide = state.optJSONObject("hide");
        for (int i = 0; i < cats.length(); i++) {
            JSONObject c = cats.optJSONObject(i);
            if (c == null) continue;
            if (hide != null && c.has("sid") && hide.has(c.optString("sid"))) continue;
            JSONArray qs = c.optJSONArray("quests");
            if (qs == null) continue;
            for (int j = 0; j < qs.length(); j++) {
                JSONObject q = qs.optJSONObject(j);
                if (q == null || q.optBoolean("done")) continue;
                long act = activationDay(q);
                boolean active = q.optBoolean("active") || (act > 0 && act <= today);
                if (q.optBoolean("rep")) {
                    // Perpetual quests: a finished one rests until its round ends ("next"), then it is due again
                    long next = q.optLong("next", 0);
                    boolean roundOver = next > 0 && System.currentTimeMillis() >= next;
                    if (q.optBoolean("rest")) active = roundOver;
                    else if (roundOver) active = true;
                }
                if (!active && !(includeUpcoming && act > 0)) continue;
                Item it = new Item();
                it.cat = c.optString("id"); it.quest = q.optString("id");
                it.title = q.optString("title"); it.board = c.optString("name"); it.color = c.optString("color", "#58cc02");
                it.due = q.optString("due"); it.activatesOn = act; it.active = active; it.flagged = q.optBoolean("active");
                JSONArray st = q.optJSONArray("steps");
                if (st != null) { it.stepsTotal = st.length(); for (int s = 0; s < st.length(); s++) if (st.optJSONObject(s) != null && st.optJSONObject(s).optBoolean("d")) it.stepsDone++; }
                out.add(it);
            }
        }
        Collections.sort(out, (a, b) -> {
            long da = day(a.due), db = day(b.due);
            if (da < 0) da = Long.MAX_VALUE; if (db < 0) db = Long.MAX_VALUE;
            return Long.compare(da, db);
        });
        return out;
    }

    // ---------- completing a quest (mirrors the "done" handler in index.html) ----------

    static int questXP(JSONObject q) {
        return (int) Math.round(10 * (1 + .25 * q.optDouble("time", 0)) * (1 + .5 * q.optDouble("diff", 0)) * (1 + .3 * q.optDouble("imp", 0)));
    }

    private static final SecureRandom RNG = new SecureRandom();

    private static String uid() {
        String a = "0123456789abcdefghijklmnopqrstuvwxyz";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < 7; i++) b.append(a.charAt(RNG.nextInt(a.length())));
        return b.toString();
    }

    /**
     * Completes a quest on the server: XP for the user and the board, history entry, and for shared boards
     * the deletion stamp plus an outbox entry that the web app reports to the guild on its next sync.
     * Returns the XP gained, or -1 if the quest no longer exists.
     */
    static int complete(Context c, String catId, String questId) throws Exception {
        synchronized (LOCK) {
            JSONObject state = http(c, "GET", "/api/state", null).optJSONObject("state");
            if (state == null) throw new IllegalStateException("no state");
            JSONArray cats = state.optJSONArray("cats");
            JSONObject cat = null, quest = null;
            for (int i = 0; cats != null && i < cats.length() && quest == null; i++) {
                JSONObject cc = cats.optJSONObject(i);
                if (cc == null || !catId.equals(cc.optString("id"))) continue;
                JSONArray qs = cc.optJSONArray("quests");
                for (int j = 0; qs != null && j < qs.length(); j++) {
                    JSONObject qq = qs.optJSONObject(j);
                    if (qq != null && questId.equals(qq.optString("id"))) { cat = cc; quest = qq; break; }
                }
            }
            if (quest == null) { prefs(c).edit().putString("state", state.toString()).apply(); return -1; }

            long now = System.currentTimeMillis();
            int xp = questXP(quest);
            state.put("xp", state.optLong("xp", 0) + xp);
            cat.put("xp", cat.optLong("xp", 0) + xp);

            JSONObject he = new JSONObject();
            he.put("id", uid());
            he.put("q", new JSONObject(quest.toString()));
            he.put("t", quest.optString("title"));
            he.put("i", cat.optString("id"));
            he.put("n", cat.optString("name"));
            he.put("c", cat.optString("color"));
            he.put("x", xp);
            he.put("d", now);

            boolean perpetual = quest.optBoolean("rep");
            if (cat.has("sid")) {
                String sid = cat.optString("sid");
                he.put("sid", sid);
                he.put("g", guildName(c, cat.optLong("gid", -1)));
                JSONArray outbox = state.optJSONArray("outbox");
                if (outbox == null) { outbox = new JSONArray(); state.put("outbox", outbox); }
                JSONObject o = new JSONObject();
                o.put("id", he.getString("id"));
                o.put("board", sid);
                o.put("t", quest.optString("title"));
                o.put("bn", cat.optString("name"));
                o.put("x", Math.min(200, Math.max(1, xp)));
                o.put("d", now);
                o.put("qid", questId);
                outbox.put(o);
                if (perpetual) quest.put("u", now); // the reset version wins over the shared copy
                else {
                    JSONObject del = cat.optJSONObject("del");
                    if (del == null) { del = new JSONObject(); cat.put("del", del); }
                    del.put(questId, now); // otherwise the shared copy would bring the quest back
                }
            }

            JSONArray hist = state.optJSONArray("hist");
            if (hist == null) { hist = new JSONArray(); state.put("hist", hist); }
            hist.put(he);

            if (perpetual) {
                // Same as the web app's repReset: steps unticked, not active, resting until its round ends
                // ("next"; the web app sets it if it is still missing and brings the quest back on time)
                JSONArray steps = quest.optJSONArray("steps");
                for (int j = 0; steps != null && j < steps.length(); j++) { JSONObject st = steps.optJSONObject(j); if (st != null) st.put("d", false); }
                quest.put("active", false);
                quest.put("rest", true);
            } else {
                JSONArray qs = cat.getJSONArray("quests"), keep = new JSONArray();
                for (int j = 0; j < qs.length(); j++) if (!questId.equals(qs.optJSONObject(j) != null ? qs.optJSONObject(j).optString("id") : null)) keep.put(qs.get(j));
                cat.put("quests", keep);
            }

            JSONObject body = new JSONObject();
            body.put("state", state);
            http(c, "PUT", "/api/state", body);
            prefs(c).edit().putString("state", state.toString()).apply();
            return xp;
        }
    }

    private static String guildName(Context c, long gid) {
        if (gid < 0) return "";
        try {
            JSONArray gs = http(c, "GET", "/api/guilds", null).optJSONArray("guilds");
            for (int i = 0; gs != null && i < gs.length(); i++) if (gs.optJSONObject(i).optLong("id") == gid) return gs.optJSONObject(i).optString("name");
        } catch (Exception ignored) { }
        return "";
    }

    static String fmtDate(Context c, String iso) {
        long d = day(iso);
        if (d < 0) return "";
        long t = today();
        if (d == t) return tr(c, "today", "today");
        if (d == plusDays(t, 1)) return tr(c, "tomorrow", "tomorrow");
        if (d < t) return tr(c, "overdueShort", "overdue");
        String loc = config(c).optString("locale", "en-GB");
        Locale l = Locale.forLanguageTag(loc);
        return new java.text.SimpleDateFormat("d MMM", l).format(new java.util.Date(d));
    }

    static int parseColor(String s, int fallback) {
        try { return android.graphics.Color.parseColor(s); } catch (Exception e) { return fallback; }
    }
}
