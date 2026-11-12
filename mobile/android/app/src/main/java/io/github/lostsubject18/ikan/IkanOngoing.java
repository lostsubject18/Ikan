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

import java.util.List;

/**
 * Helpers and button handling for the pinned active-quest notification (shown by IkanOngoingService):
 * which quest is current, back / next / done, and a refresh roughly every 30 minutes.
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

    /** Starts, refreshes or removes the pinned notification. */
    static void update(Context c) {
        IkanOngoingService.sync(c);
    }

    static int index(Context c) {
        int n = IkanWidgetService.rows(c).size();
        if (n == 0) return 0;
        int i = IkanData.prefs(c).getInt("ongoingIndex", 0);
        return ((i % n) + n) % n;
    }

    static IkanData.Item current(Context c) {
        List<IkanData.Item> rows = IkanWidgetService.rows(c);
        return rows.isEmpty() ? null : rows.get(index(c));
    }

    static void step(Context c, int d) {
        IkanData.prefs(c).edit().putInt("ongoingIndex", index(c) + d).apply();
    }

    static void channel(Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, IkanData.tr(c, "ongoingChannel", "Active quests (persistent)"), NotificationManager.IMPORTANCE_LOW);
        ch.setDescription(IkanData.tr(c, "ongoingChannelDesc", "Shows your active quests on the lock screen"));
        ch.setShowBadge(false);
        ch.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
        nm.createNotificationChannel(ch);
    }

    static PendingIntent broadcast(Context c, String action, int code, Intent extras) {
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

    @Override
    public void onReceive(Context context, Intent intent) {
        String a = intent.getAction();
        if (ACTION_PREV.equals(a) || ACTION_NEXT.equals(a)) {
            step(context, ACTION_NEXT.equals(a) ? 1 : -1);
            update(context);
        } else if (ACTION_DONE.equals(a)) {
            String cat = intent.getStringExtra(IkanWidgetProvider.EXTRA_CAT), quest = intent.getStringExtra(IkanWidgetProvider.EXTRA_QUEST);
            if (cat == null || quest == null) return;
            IkanWidgetProvider.hide(context, quest, true);
            IkanWidgetProvider.render(context); // feels instant; also redraws the pinned notification
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
                IkanWidgetProvider.render(context);
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
}
