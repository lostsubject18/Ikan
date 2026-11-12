# Ikan Quests – Android app

A Capacitor shell that opens the Ikan server `https://ikan.tail76472d.ts.net` in an app window.
Server updates show up in the app right away; only changes to icon, name or native settings need a new APK.
If the server is unreachable (Tailscale off), the app shows `www/offline.html` with a retry button.

## Build

GitHub Actions (`.github/workflows/android.yml`) builds a signed release APK on every push that touches `mobile/`
and attaches it to the release **android-latest**: https://github.com/lostsubject18/Ikan/releases/tag/android-latest

Required repository secrets:

| Secret | Content |
| --- | --- |
| `ANDROID_KEYSTORE_B64` | base64 of the PKCS12 keystore |
| `ANDROID_KEYSTORE_PASSWORD` | keystore and key password |
| `ANDROID_KEY_ALIAS` | `ikan` |

Keep the keystore backed up: every update must be signed with the same key.

## Install on a phone

1. Tailscale installed and connected.
2. Open the release link on the phone, download `ikan-quests.apk`, allow "install unknown apps" for the browser once.
3. Later builds install over the existing app.

## Change things

- Server address: `capacitor.config.json` (`server.url`, `allowNavigation`, and the retry link in `www/offline.html`).
- Icon and splash: edit `assets/make-icons.cjs`, then `node assets/make-icons.cjs && npm run icons`.
