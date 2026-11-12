package io.github.lostsubject18.ikan;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.List;

/**
 * Persistent, silent notification (also on the lock screen) that shows one active quest at a time,
 * with ‹ ✓ › buttons like a music player: browse the active quests and complete the one shown.
 * Refreshed together with the widget and every ~30 minutes while switched on.
 */
public class IkanOngoing extends BroadcastReceiver {
    static final String CHANNEL = "ikan_ongoing";
    static final int ID = 2001;
    static final String ACTION_PREV = "io.github.lostsubject18.ikan.ONGOING_PREV";
    static final String ACTION_NEXT = "io.github.lostsubject18.ikan.ONGOING_NEXT";
    static final String ACTION_DONE = "io.github.lostsubject18.ikan.ONGOING_DONE";
    static final String ACTION_TICK = "io.github.lostsubject18.ikan.ONGOING_TICK";

    static boolean enabled(Context c) {
        return IkanData.signedIn(c) && IkanData.settings(c).optBoolean("ongoing", true);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (ACTION_PREV.equals(a) || ACTION_NEXT.equals(a)) {
            int i = IkanData.prefs(context).getInt("ongoingIndex", 0) + (ACTION_NEXT.equals(a) ? 1 : -1);
            IkanData.prefs(context).edit().putInt("ongoingIndex", i).apply();
            update(context);
        } else if (ACTION_DONE.equals(a)) {
            String cat = intent.getStringExtra(IkanWidgetProvider.EXTRA_CAT), quest = intent.getStringExtra(IkanWidgetProvider.EXTRA_QUEST);
            if (cat == null || quest == null) return;
            IkanWidgetProvider.hide(context, quest, true);
            update(context);
            PendingResult pr = goAsync();
            new Thread(() -> {
                String msg;
                try {
                    int xp = IkanData.complete(context, cat, quest);
                    msg = xp >= 0 ? IkanData.tr(context, "doneToast", "Quest complete! +{xp} XP", "xp", String.valueOf(xp)) : null;
                } catch (Exception e) {
                    msg = IkanData.tr(context, "failToast", "Could not complete the quest. Is Tailscale on?");
                }
                IkanWidgetProvider.hide(context, quest, false);
                IkanWidgetProvider.render(context); // also redraws this notification
                final String m = msg;
                if (m != null) new Handler(Looper.getMainLooper()).post(() -> Toast.makeText(context.getApplicationContext(), m, Toast.LENGTH_SHORT).show());
                pr.finish();
            }).start();
        } else if (ACTION_TICK.equals(a)) {
            PendingResult pr = goAsync();
            new Thread(() -> {
                try {
                    IkanData.loadState(context, true);
                    IkanWidgetProvider.render(context);
                } finally {
                    scheduleTick(context);
                    pr.finish();
                }
            }).start();
        }
    }

    private static PendingIntent broadcast(Context c, String action, int code, Intent extras) {
        Intent i = new Intent(c, IkanOngoing.class).setAction(action);
        if (extras != null) i.putExtras(extras);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        return PendingIntent.getBroadcast(c, code, i, flags);
    }

    /** Keeps the notification fresh while it is switched on (inexact, ~every 30 minutes). */
    static void scheduleTick(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent pi = broadcast(c, ACTION_TICK, 30, null);
        am.cancel(pi);
        if (enabled(c)) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + 30 * 60 * 1000L, pi);
    }

    private static void channel(Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, IkanData.tr(c, "ongoingChannel", "Active quests (persistent)"), NotificationManager.IMPORTANCE_LOW);
        ch.setDescription(IkanData.tr(c, "ongoingChannelDesc", "Shows your active quests on the lock screen"));
        ch.setShowBadge(false);
        ch.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
        nm.createNotificationChannel(ch);
    }

    /** Posts, updates or removes the notification from the cached state (no network). */
    static void update(Context c) {
        NotificationManagerCompat nm = NotificationManagerCompat.from(c);
        if (!enabled(c)) { nm.cancel(ID); return; }
        List<IkanData.Item> rows = IkanWidgetService.rows(c);
        if (rows.isEmpty() || !nm.areNotificationsEnabled()) { nm.cancel(ID); return; }
        int n = rows.size();
        int i = ((IkanData.prefs(c).getInt("ongoingIndex", 0) % n) + n) % n;
        IkanData.prefs(c).edit().putInt("ongoingIndex", i).apply();
        IkanData.Item it = rows.get(i);

        StringBuilder sub = new StringBuilder(it.board);
        String due = IkanData.fmtDate(c, it.due);
        if (!due.isEmpty()) sub.append(" · ").append(due);
        if (it.stepsTotal > 0) sub.append(" · ").append(it.stepsDone).append('/').append(it.stepsTotal);

        channel(c);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        PendingIntent open = PendingIntent.getActivity(c, 40,
                new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), flags);
        Intent done = new Intent().putExtra(IkanWidgetProvider.EXTRA_CAT, it.cat).putExtra(IkanWidgetProvider.EXTRA_QUEST, it.quest);

        NotificationCompat.Builder b = new NotificationCompat.Builder(c, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_ikan)
                .setColor(IkanData.parseColor(it.color, 0xFF58CC02))
                .setColorized(false)
                .setContentTitle(it.title)
                .setContentText(sub.toString())
                .setSubText(IkanData.tr(c, "ongoingCount", "{i} of {n} active quests", "i", String.valueOf(i + 1), "n", String.valueOf(n)))
                .setContentIntent(open)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setShowWhen(false)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setCategory(NotificationCompat.CATEGORY_STATUS)
                .setPriority(NotificationCompat.PRIORITY_LOW);
        if (n > 1) b.addAction(0, "‹  " + IkanData.tr(c, "ongoingPrev", "Back"), broadcast(c, ACTION_PREV, 41, null));
        b.addAction(0, "✓  " + IkanData.tr(c, "ongoingDone", "Done"), broadcast(c, ACTION_DONE, 42, done));
        if (n > 1) b.addAction(0, IkanData.tr(c, "ongoingNext", "Next") + "  ›", broadcast(c, ACTION_NEXT, 43, null));
        try { nm.notify(ID, b.build()); } catch (SecurityException ignored) { }
    }
}
