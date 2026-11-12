package io.github.lostsubject18.ikan;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(IkanNativePlugin.class); // widget + reminders bridge, must be registered before super.onCreate
        super.onCreate(savedInstanceState);

        // The app is a single page without history, so Android's default would close it on every back gesture.
        // Ask the page first (window.IkanBack in native.js): it steps back in / closes an open window.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView wv = getBridge() != null ? getBridge().getWebView() : null;
                if (wv == null) { moveTaskToBack(true); return; }
                wv.evaluateJavascript("(function(){try{return !!(window.IkanBack&&window.IkanBack())}catch(e){return false}})()",
                        handled -> { if (!"true".equals(handled)) moveTaskToBack(true); });
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();
        IkanOngoing.update(this); // the app is in the foreground: allowed to (re)start the pinned notification
    }

    @Override
    public void onPause() {
        super.onPause();
        IkanWidgetProvider.refreshAsync(this, null); // pick up changes made in the app
    }
}
