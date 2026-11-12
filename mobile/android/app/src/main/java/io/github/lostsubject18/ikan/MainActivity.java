package io.github.lostsubject18.ikan;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IkanNativePlugin.class); // widget + reminders bridge, must be registered before super.onCreate
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        IkanWidgetProvider.refreshAsync(this, null); // pick up changes made in the app
    }
}
