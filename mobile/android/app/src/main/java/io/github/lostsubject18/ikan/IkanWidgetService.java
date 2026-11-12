package io.github.lostsubject18.ikan;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import java.util.ArrayList;
import java.util.List;

/**
 * Widget rows. On Android 12+ the provider hands the rows over directly (RemoteCollectionItems);
 * this service is only the fallback for Android 7 to 11.
 */
public class IkanWidgetService extends RemoteViewsService {
    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new Factory(getApplicationContext());
    }

    /** Quests the widget shows right now: active, minus the ones just ticked. */
    static List<IkanData.Item> rows(Context ctx) {
        List<IkanData.Item> out = new ArrayList<>();
        if (!IkanData.signedIn(ctx)) return out;
        for (IkanData.Item it : IkanData.items(IkanData.loadState(ctx, false), false))
            if (!IkanWidgetProvider.hidden(ctx, it.quest)) out.add(it);
        return out;
    }

    /** One row: colour bar, title, "board · deadline · steps", tick button. */
    static RemoteViews row(Context ctx, IkanData.Item it) {
        RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.ikan_widget_item);
        v.setTextViewText(R.id.i_title, it.title);
        StringBuilder sub = new StringBuilder(it.board);
        String due = IkanData.fmtDate(ctx, it.due);
        if (!due.isEmpty()) sub.append("  ·  ").append(due);
        if (it.stepsTotal > 0) sub.append("  ·  ").append(it.stepsDone).append('/').append(it.stepsTotal);
        v.setTextViewText(R.id.i_sub, sub.toString());
        long d = IkanData.day(it.due), today = IkanData.today();
        int subColor = d >= 0 && d < today ? Color.parseColor("#ff4b4b")
                : d >= 0 && d <= IkanData.plusDays(today, 2) ? Color.parseColor("#ff9600") : Color.parseColor("#97a8b2");
        v.setTextColor(R.id.i_sub, subColor);
        v.setInt(R.id.i_bar, "setBackgroundColor", IkanData.parseColor(it.color, Color.parseColor("#58cc02")));
        v.setContentDescription(R.id.i_check, IkanData.tr(ctx, "markDone", "Mark as done") + ": " + it.title);
        Intent fill = new Intent()
                .putExtra(IkanWidgetProvider.EXTRA_CAT, it.cat)
                .putExtra(IkanWidgetProvider.EXTRA_QUEST, it.quest);
        v.setOnClickFillInIntent(R.id.i_check, fill);
        return v;
    }

    static final class Factory implements RemoteViewsFactory {
        private final Context ctx;
        private List<IkanData.Item> rows = new ArrayList<>();

        Factory(Context ctx) { this.ctx = ctx; }

        @Override public void onCreate() { }
        @Override public void onDestroy() { rows.clear(); }
        @Override public void onDataSetChanged() { rows = IkanWidgetService.rows(ctx); }
        @Override public int getCount() { return rows.size(); }

        @Override
        public RemoteViews getViewAt(int pos) {
            if (pos >= rows.size()) return new RemoteViews(ctx.getPackageName(), R.layout.ikan_widget_item);
            return row(ctx, rows.get(pos));
        }

        @Override public RemoteViews getLoadingView() { return null; }
        @Override public int getViewTypeCount() { return 1; }
        @Override public long getItemId(int pos) { return pos < rows.size() ? rows.get(pos).quest.hashCode() : pos; }
        @Override public boolean hasStableIds() { return true; }
    }
}
