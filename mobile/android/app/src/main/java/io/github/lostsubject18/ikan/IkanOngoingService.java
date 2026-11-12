package io.github.lostsubject18.ikan;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.support.v4.media.MediaMetadataCompat;
import android.support.v4.media.session.MediaSessionCompat;
import android.support.v4.media.session.PlaybackStateCompat;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.app.ServiceCompat;
import androidx.core.content.ContextCompat;

import java.util.List;

/**
 * Keeps the active-quest notification pinned at the top like a music player: a foreground service holding a
 * media session. The "track" is the current quest; previous / next browse the active quests, ✓ completes it.
 * Since Android 14 only media-session notifications stay on top and cannot be swiped away.
 */
public class IkanOngoingService extends Service {
    private static volatile IkanOngoingService instance;
    private static final String CUSTOM_DONE = "ikan.done";
    private MediaSessionCompat session;
    private final Handler main = new Handler(Looper.getMainLooper());

    /** Starts, refreshes or stops the service to match the settings. Safe to call from any thread. */
    static void sync(Context c) {
        Context app = c.getApplicationContext();
        boolean want = IkanOngoing.enabled(app) && NotificationManagerCompat.from(app).areNotificationsEnabled();
        IkanOngoingService s = instance;
        if (!want) {
            if (s != null) s.main.post(s::shutdown);
            NotificationManagerCompat.from(app).cancel(IkanOngoing.ID);
            return;
        }
        if (s != null) { s.main.post(s::refresh); return; }
        try {
            ContextCompat.startForegroundService(app, new Intent(app, IkanOngoingService.class));
        } catch (Exception ignored) {
            // Android does not allow starting it from the background; the next app start (or reboot) does.
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        session = new MediaSessionCompat(this, "IkanQuests");
        session.setCallback(new MediaSessionCompat.Callback() {
            @Override public void onSkipToNext() { IkanOngoing.step(IkanOngoingService.this, +1); refresh(); }
            @Override public void onSkipToPrevious() { IkanOngoing.step(IkanOngoingService.this, -1); refresh(); }
            @Override public void onCustomAction(String action, android.os.Bundle extras) { if (CUSTOM_DONE.equals(action)) completeCurrent(); }
            @Override public void onPlay() { completeCurrent(); } // some players map the centre button to play
        });
        PendingIntent open = PendingIntent.getActivity(this, 50, new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), immutable());
        session.setSessionActivity(open);
        session.setActive(true);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification n = build();
        int type = Build.VERSION.SDK_INT >= 34 ? ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE : 0;
        ServiceCompat.startForeground(this, IkanOngoing.ID, n, type);
        if (!IkanOngoing.enabled(this)) shutdown();
        return START_STICKY;
    }

    @Override public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onDestroy() {
        instance = null;
        if (session != null) { session.setActive(false); session.release(); }
        super.onDestroy();
    }

    void refresh() {
        if (!IkanOngoing.enabled(this)) { shutdown(); return; }
        try { NotificationManagerCompat.from(this).notify(IkanOngoing.ID, build()); } catch (SecurityException ignored) { }
    }

    void shutdown() {
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE);
        stopSelf();
    }

    private void completeCurrent() {
        IkanData.Item it = IkanOngoing.current(this);
        if (it == null) return;
        Intent i = new Intent(this, IkanOngoing.class).setAction(IkanOngoing.ACTION_DONE)
                .putExtra(IkanWidgetProvider.EXTRA_CAT, it.cat).putExtra(IkanWidgetProvider.EXTRA_QUEST, it.quest);
        sendBroadcast(i); // same path as the widget tick: server call off the main thread, then redraw
    }

    private static int immutable() {
        return PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
    }

    /** Cover art: board colour with the white fish. */
    private Bitmap art(int color) {
        int size = 256;
        Bitmap b = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(b);
        cv.drawColor(color);
        Drawable fish = ContextCompat.getDrawable(this, R.drawable.ic_stat_ikan);
        if (fish != null) {
            fish.mutate().setTint(0xFFFFFFFF);
            int pad = size / 5;
            fish.setBounds(pad, pad, size - pad, size - pad);
            fish.draw(cv);
        }
        return b;
    }

    private Notification build() {
        IkanOngoing.channel(this);
        List<IkanData.Item> rows = IkanWidgetService.rows(this);
        int n = rows.size();
        IkanData.Item it = IkanOngoing.current(this);
        String title, sub, count;
        int color;
        if (it == null) {
            title = IkanData.tr(this, "widgetTitle", "Active quests");
            sub = IkanData.tr(this, "widgetEmpty", "No active quests. Pick new ones or relax a little.");
            count = "";
            color = 0xFF58CC02;
        } else {
            title = it.title;
            StringBuilder s = new StringBuilder(it.board);
            String due = IkanData.fmtDate(this, it.due);
            if (!due.isEmpty()) s.append(" · ").append(due);
            if (it.stepsTotal > 0) s.append(" · ").append(it.stepsDone).append('/').append(it.stepsTotal);
            sub = s.toString();
            count = IkanData.tr(this, "ongoingCount", "{i} of {n} active quests",
                    "i", String.valueOf(IkanOngoing.index(this) + 1), "n", String.valueOf(n));
            color = IkanData.parseColor(it.color, 0xFF58CC02);
        }
        Bitmap cover = art(color);

        // What the media player on the lock screen / in quick settings shows
        session.setMetadata(new MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_TITLE, title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, sub)
                .putString(MediaMetadataCompat.METADATA_KEY_DISPLAY_SUBTITLE, sub)
                .putString(MediaMetadataCompat.METADATA_KEY_ALBUM, count)
                .putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, cover)
                .putBitmap(MediaMetadataCompat.METADATA_KEY_DISPLAY_ICON, cover)
                .build());
        long actions = n > 1 ? (PlaybackStateCompat.ACTION_SKIP_TO_NEXT | PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS) : 0;
        PlaybackStateCompat.Builder ps = new PlaybackStateCompat.Builder()
                .setActions(actions)
                // "playing" keeps it pinned; speed 0 and no duration means no progress bar
                .setState(it != null ? PlaybackStateCompat.STATE_PLAYING : PlaybackStateCompat.STATE_PAUSED,
                        PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, 0f);
        if (it != null) ps.addCustomAction(new PlaybackStateCompat.CustomAction.Builder(
                CUSTOM_DONE, IkanData.tr(this, "ongoingDone", "Done"), R.drawable.ic_quest_done).build());
        session.setPlaybackState(ps.build());

        PendingIntent open = PendingIntent.getActivity(this, 40, new Intent(this, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), immutable());
        NotificationCompat.Builder b = new NotificationCompat.Builder(this, IkanOngoing.CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_ikan)
                .setColor(color)
                .setLargeIcon(cover)
                .setContentTitle(title)
                .setContentText(sub)
                .setSubText(count)
                .setContentIntent(open)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setShowWhen(false)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setCategory(NotificationCompat.CATEGORY_STATUS)
                .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE);

        // Buttons for Android versions that draw the notification itself (before Android 13)
        int slot = 0;
        int[] compact = new int[3];
        if (it != null && n > 1) { b.addAction(R.drawable.ic_quest_prev, IkanData.tr(this, "ongoingPrev", "Back"), IkanOngoing.broadcast(this, IkanOngoing.ACTION_PREV, 41, null)); compact[slot] = slot; slot++; }
        if (it != null) {
            Intent done = new Intent().putExtra(IkanWidgetProvider.EXTRA_CAT, it.cat).putExtra(IkanWidgetProvider.EXTRA_QUEST, it.quest);
            b.addAction(R.drawable.ic_quest_done, IkanData.tr(this, "ongoingDone", "Done"), IkanOngoing.broadcast(this, IkanOngoing.ACTION_DONE, 42, done));
            compact[slot] = slot; slot++;
        }
        if (it != null && n > 1) { b.addAction(R.drawable.ic_quest_next, IkanData.tr(this, "ongoingNext", "Next"), IkanOngoing.broadcast(this, IkanOngoing.ACTION_NEXT, 43, null)); compact[slot] = slot; slot++; }
        int[] shown = new int[slot];
        System.arraycopy(compact, 0, shown, 0, slot);
        b.setStyle(new androidx.media.app.NotificationCompat.MediaStyle()
                .setMediaSession(session.getSessionToken())
                .setShowActionsInCompactView(shown));
        return b.build();
    }
}
