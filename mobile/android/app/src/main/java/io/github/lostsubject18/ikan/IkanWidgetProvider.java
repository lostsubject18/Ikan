package io.github.lostsubject18.ikan;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.widget.RemoteViews;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

/** Home screen widget: active quests with a ✓ button that completes the quest on the server. */
public class IkanWidgetProvider extends AppWidgetProvider {
    static final String ACTION_COMPLETE = "io.github.lostsubject18.ikan.WIDGET_COMPLETE";
    static final String ACTION_REFRESH = "io.github.lostsubject18.ikan.WIDGET_REFRESH";
    static final String EXTRA_CAT = "cat", EXTRA_QUEST = "quest";

    @Override
    public void onUpdate(Context context, AppWidgetManager mgr, int[] ids) {
        render(context);
        refreshAsync(context, null);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent.getAction();
        if (ACTION_REFRESH.equals(action)) {
            refreshAsync(context, goAsync());
        } else if (ACTION_COMPLETE.equals(action)) {
            String cat = intent.getStringExtra(EXTRA_CAT), quest = intent.getStringExtra(EXTRA_QUEST);
            if (cat == null || quest == null) return;
            hide(context, quest, true); // feels instant; restored if the server call fails
            render(context);
            PendingResult pr = goAsync();
            new Thread(() -> {
                String msg;
                try {
                    int xp = IkanData.complete(context, cat, quest);
                    msg = xp >= 0 ? IkanData.tr(context, "doneToast", "Quest complete! +{xp} XP", "xp", String.valueOf(xp)) : null;
                } catch (Exception e) {
                    msg = IkanData.tr(context, "failToast", "Could not complete the quest. Is Tailscale on?");
                }
                hide(context, quest, false);
                IkanAlarmReceiver.schedule(context);
                render(context);
                final String m = msg;
                if (m != null) new Handler(Looper.getMainLooper()).post(() -> Toast.makeText(context.getApplicationContext(), m, Toast.LENGTH_SHORT).show());
                pr.finish();
            }).start();
        }
    }

    /** Quests ticked in the widget stay hidden until the server round trip is done. */
    static void hide(Context c, String quest, boolean on) {
        try {
            JSONObject h = new JSONObject(IkanData.prefs(c).getString("hidden", "{}"));
            if (on) h.put(quest, System.currentTimeMillis()); else h.remove(quest);
            IkanData.prefs(c).edit().putString("hidden", h.toString()).apply();
        } catch (Exception ignored) { }
    }

    static boolean hidden(Context c, String quest) {
        try { return new JSONObject(IkanData.prefs(c).getString("hidden", "{}")).has(quest); } catch (Exception e) { return false; }
    }

    /** Reloads quests from the server, then redraws every widget. */
    static void refreshAsync(Context context, PendingResult pr) {
        new Thread(() -> {
            try {
                if (IkanData.signedIn(context)) IkanData.loadState(context, true);
                render(context);
            } finally {
                if (pr != null) pr.finish();
            }
        }).start();
    }

    static void requestUpdate(Context context) {
        Intent i = new Intent(context, IkanWidgetProvider.class).setAction(ACTION_REFRESH);
        context.sendBroadcast(i);
    }

    static void render(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        IkanOngoing.update(context); // the lock screen notification shows the same list
        int[] ids = mgr.getAppWidgetIds(new ComponentName(context, IkanWidgetProvider.class));
        if (ids == null || ids.length == 0) return;
        boolean in = IkanData.signedIn(context);
        List<IkanData.Item> rows = IkanWidgetService.rows(context);
        int count = rows.size();
        String empty;
        if (!in) empty = IkanData.tr(context, "widgetSignIn", "Open Ikan Quests and sign in.");
        else if (!IkanData.hasState(context) && !IkanData.lastError(context).isEmpty())
            empty = IkanData.tr(context, "widgetOffline", "Server not reachable. Is Tailscale on?") + "\n" + IkanData.lastError(context);
        else empty = IkanData.tr(context, "widgetEmpty", "No active quests. Pick new ones or relax a little.");
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0);
        PendingIntent open = PendingIntent.getActivity(context, 0,
                new Intent(context, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP), flags);
        PendingIntent refresh = PendingIntent.getBroadcast(context, 1,
                new Intent(context, IkanWidgetProvider.class).setAction(ACTION_REFRESH), flags);
        int mutable = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
        PendingIntent tick = PendingIntent.getBroadcast(context, 2,
                new Intent(context, IkanWidgetProvider.class).setAction(ACTION_COMPLETE), mutable);

        for (int id : ids) {
            RemoteViews v = new RemoteViews(context.getPackageName(), R.layout.ikan_widget);
            v.setTextViewText(R.id.w_title, IkanData.tr(context, "widgetTitle", "Active quests"));
            v.setTextViewText(R.id.w_count, String.valueOf(count));
            v.setTextViewText(R.id.w_empty, empty);
            v.setOnClickPendingIntent(R.id.w_header, open);
            v.setOnClickPendingIntent(R.id.w_empty, open);
            v.setOnClickPendingIntent(R.id.w_refresh, refresh);

            if (Build.VERSION.SDK_INT >= 31) {
                // Android 12+: hand the rows over directly, no list service involved
                RemoteViews.RemoteCollectionItems.Builder b = new RemoteViews.RemoteCollectionItems.Builder()
                        .setHasStableIds(true).setViewTypeCount(1);
                for (IkanData.Item it : rows) b.addItem(it.quest.hashCode(), IkanWidgetService.row(context, it));
                v.setRemoteAdapter(R.id.w_list, b.build());
            } else {
                Intent svc = new Intent(context, IkanWidgetService.class).putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, id);
                svc.setData(Uri.parse(svc.toUri(Intent.URI_INTENT_SCHEME)));
                v.setRemoteAdapter(R.id.w_list, svc);
            }
            v.setEmptyView(R.id.w_list, R.id.w_empty);
            v.setPendingIntentTemplate(R.id.w_list, tick);
            mgr.updateAppWidget(id, v);
        }
        if (Build.VERSION.SDK_INT < 31) mgr.notifyAppWidgetViewDataChanged(ids, R.id.w_list);
    }
}
