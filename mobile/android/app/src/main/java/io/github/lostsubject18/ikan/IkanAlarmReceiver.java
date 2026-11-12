package io.github.lostsubject18.ikan;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * One alarm a day at the chosen time (default 08:00). When it fires, the quests are reloaded from the
 * server and up to five notifications are posted: due tomorrow / today, overdue, auto-activated today,
 * and a daily summary. The alarm is set again after every run, after a reboot and after an app update.
 */
public class IkanAlarmReceiver extends BroadcastReceiver {
    static final String ACTION_DAILY = "io.github.lostsubject18.ikan.DAILY_REMINDER";
    static final String CHANNEL = "ikan_reminders";
    private static final int ID_TOMORROW = 1001, ID_TODAY = 1002, ID_OVERDUE = 1003, ID_ACTIVATED = 1004, ID_SUMMARY = 1005, ID_TEST = 1006;

    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (ACTION_DAILY.equals(a)) {
            PendingResult pr = goAsync();
            new Thread(() -> {
                try {
                    notifyNow(context);
                    IkanWidgetProvider.render(context);
                } finally {
                    schedule(context);
                    pr.finish();
                }
            }).start();
        } else if (Intent.ACTION_BOOT_COMPLETED.equals(a) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)
                || Intent.ACTION_TIME_CHANGED.equals(a) || Intent.ACTION_TIMEZONE_CHANGED.equals(a)) {
            schedule(context);
            IkanWidgetProvider.requestUpdate(context);
        }
    }

    private static PendingIntent alarmIntent(Context c) {
        Intent i = new Intent(c, IkanAlarmReceiver.class).setAction(ACTION_DAILY);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        return PendingIntent.getBroadcast(c, 10, i, flags);
    }

    /** Sets (or cancels) the next daily run according to the current settings. */
    static void schedule(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent pi = alarmIntent(c);
        am.cancel(pi);
        JSONObject s = IkanData.settings(c);
        if (!IkanData.signedIn(c) || !s.optBoolean("on", true)) return;
        if (!(s.optBoolean("deadline", true) || s.optBoolean("auto", true) || s.optBoolean("daily", true) || s.optBoolean("overdue", true))) return;
        int hh = 8, mm = 0;
        try {
            String[] t = s.optString("time", "08:00").split(":");
            hh = Math.max(0, Math.min(23, Integer.parseInt(t[0])));
            mm = Math.max(0, Math.min(59, Integer.parseInt(t[1])));
        } catch (Exception ignored) { }
        Calendar k = Calendar.getInstance();
        k.set(Calendar.HOUR_OF_DAY, hh); k.set(Calendar.MINUTE, mm); k.set(Calendar.SECOND, 0); k.set(Calendar.MILLISECOND, 0);
        if (k.getTimeInMillis() <= System.currentTimeMillis() + 5000) k.add(Calendar.DAY_OF_MONTH, 1);
        // Inexact but battery friendly; Android may shift it by a few minutes. No exact-alarm permission needed.
        am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, k.getTimeInMillis(), pi);
    }

    private static void channel(Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, IkanData.tr(c, "channel", "Quest reminders"), NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription(IkanData.tr(c, "channelDesc", "Deadlines, overdue and newly activated quests"));
        nm.createNotificationChannel(ch);
    }

    private static void post(Context c, int id, String title, List<String> lines, String text) {
        NotificationManagerCompat nm = NotificationManagerCompat.from(c);
        if (!nm.areNotificationsEnabled()) return;
        channel(c);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        PendingIntent open = PendingIntent.getActivity(c, 20 + id,
                new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), flags);
        NotificationCompat.Builder b = new NotificationCompat.Builder(c, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_ikan)
                .setColor(0xFF58CC02)
                .setContentTitle(title)
                .setContentText(text)
                .setContentIntent(open)
                .setAutoCancel(true)
                .setGroup("ikan_daily")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        if (lines != null && lines.size() > 1) {
            NotificationCompat.InboxStyle st = new NotificationCompat.InboxStyle();
            for (String l : lines) st.addLine(l);
            b.setStyle(st);
        }
        try { nm.notify(id, b.build()); } catch (SecurityException ignored) { } // permission withdrawn
    }

    private static void postList(Context c, int id, String title, List<IkanData.Item> list) {
        if (list.isEmpty()) return;
        List<String> lines = new ArrayList<>();
        for (IkanData.Item it : list) lines.add(it.title);
        String text = list.size() == 1 ? list.get(0).title : android.text.TextUtils.join(", ", lines);
        post(c, id, title.replace("{n}", String.valueOf(list.size())), lines, text);
    }

    /** Evaluates today's reminders and posts them. Runs on a background thread. */
    static void notifyNow(Context c) {
        if (!IkanData.signedIn(c)) return;
        JSONObject s = IkanData.settings(c);
        if (!s.optBoolean("on", true)) return;
        JSONObject state = IkanData.loadState(c, true);
        List<IkanData.Item> all = IkanData.items(state, false);
        long today = IkanData.today(), tomorrow = IkanData.plusDays(today, 1);
        List<IkanData.Item> dueToday = new ArrayList<>(), dueTomorrow = new ArrayList<>(), overdue = new ArrayList<>(), activated = new ArrayList<>();
        for (IkanData.Item it : all) {
            long d = IkanData.day(it.due);
            if (d == today) dueToday.add(it);
            else if (d == tomorrow) dueTomorrow.add(it);
            else if (d >= 0 && d < today) overdue.add(it);
            if (it.activatesOn == today && !it.flagged) activated.add(it);
        }
        if (s.optBoolean("deadline", true)) {
            postList(c, ID_TODAY, IkanData.tr(c, "nDueToday", "Due today"), dueToday);
            postList(c, ID_TOMORROW, IkanData.tr(c, "nDueTomorrow", "Due tomorrow"), dueTomorrow);
        }
        if (s.optBoolean("overdue", true)) postList(c, ID_OVERDUE, IkanData.tr(c, "nOverdue", "Overdue"), overdue);
        if (s.optBoolean("auto", true)) postList(c, ID_ACTIVATED, IkanData.tr(c, "nActivated", "Quest activated"), activated);
        if (s.optBoolean("daily", true) && !all.isEmpty()) {
            IkanData.Item top = all.get(0); // sorted by deadline
            String due = IkanData.fmtDate(c, top.due);
            post(c, ID_SUMMARY,
                    IkanData.tr(c, "nSummary", "{n} active quests", "n", String.valueOf(all.size())),
                    null,
                    IkanData.tr(c, "nSummaryTop", "Most urgent: {t}", "t", top.title + (due.isEmpty() ? "" : " (" + due + ")")));
        }
    }

    /** Shown from the settings screen so you can check that notifications arrive. */
    static void postTest(Context c) {
        post(c, ID_TEST, IkanData.tr(c, "nTestTitle", "Ikan Quests"), null, IkanData.tr(c, "nTestText", "Notifications work. Your daily reminder comes at {time}.", "time", IkanData.settings(c).optString("time", "08:00")));
    }
}
