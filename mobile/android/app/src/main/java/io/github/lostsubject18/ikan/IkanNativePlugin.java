package io.github.lostsubject18.ikan;

import android.Manifest;
import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONObject;

/**
 * Bridge for the web app (public/native.js):
 *   configure({server, token, locale, settings, tr})  - after sign-in, on every save and when settings change
 *   refresh()                                          - reload the widget
 *   requestPermission() -> {granted}                   - Android 13+ notification permission
 *   test() -> {granted}                                - post a test notification plus today's reminders
 */
@CapacitorPlugin(
        name = "IkanNative",
        permissions = { @Permission(strings = { Manifest.permission.POST_NOTIFICATIONS }, alias = "notifications") }
)
public class IkanNativePlugin extends Plugin {

    @PluginMethod
    public void configure(PluginCall call) {
        Context c = getContext();
        try {
            JSONObject next = new JSONObject(call.getData().toString());
            String oldToken = IkanData.config(c).optString("token");
            if (!oldToken.equals(next.optString("token"))) IkanData.clearState(c); // other account or signed out
            IkanData.saveConfig(c, next);
            IkanAlarmReceiver.schedule(c);
            IkanWidgetProvider.refreshAsync(c, null);
            call.resolve(status(c));
        } catch (Exception e) {
            call.reject("configure failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void refresh(PluginCall call) {
        IkanWidgetProvider.refreshAsync(getContext(), null);
        call.resolve(status(getContext()));
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 33 && getPermissionState("notifications") != PermissionState.GRANTED) {
            requestPermissionForAlias("notifications", call, "permissionResult");
        } else {
            call.resolve(status(getContext()));
        }
    }

    @PermissionCallback
    private void permissionResult(PluginCall call) {
        IkanAlarmReceiver.schedule(getContext());
        call.resolve(status(getContext()));
    }

    @PluginMethod
    public void test(PluginCall call) {
        Context c = getContext();
        new Thread(() -> {
            IkanAlarmReceiver.postTest(c);
            IkanAlarmReceiver.notifyNow(c);
            call.resolve(status(c));
        }).start();
    }

    private static JSObject status(Context c) {
        JSObject r = new JSObject();
        r.put("granted", NotificationManagerCompat.from(c).areNotificationsEnabled());
        r.put("signedIn", IkanData.signedIn(c));
        return r;
    }
}
