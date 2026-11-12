# Ikan Quests

A self-hosted, quest-style productivity app. One container, no external services.
All data lives in a SQLite file in `/data`. Multiple local users are supported.
The interface is available in 11 languages (English by default: German, French, Italian, Spanish, Mandarin, Cantonese, Korean, Japanese, Hindi, Arabic); switch it with the language button at the bottom left.

## Install on Unraid

1. Push this project to your GitHub repository (`main` branch).
   The included GitHub Action builds the image `ghcr.io/lostsubject18/ikan:latest` automatically.
2. On GitHub open your profile > Packages > `ikan` > Package settings and set the visibility to **Public**.
3. Copy `unraid/ikan.xml` to your Unraid flash drive at
   `/boot/config/plugins/dockerMan/templates-user/ikan.xml`
4. In Unraid open Docker > **Add Container** and pick the template `ikan`, then click Apply.
5. Open the WebUI. The first account you create becomes the admin.
   The admin creates further users from the account menu (top right).

Backup: copy the appdata folder `ikan` (or include it in your appdata backup plugin).
Update: Docker tab > "Force Update" on the container.

## Beta access via Tailscale (Unraid)

1. Tailscale admin console > DNS: enable **HTTPS Certificates** (once per tailnet).
2. Unraid > Docker > ikan > Edit: **Use Tailscale** on, hostname `ikan`, **Tailscale Serve** = Serve, port `3000`. Leave *Extra Parameters* empty (no `--user`): the image starts as root so the Tailscale hook can run, then drops the app to `PUID`/`PGID` (default 99/100).
3. Open the container log once and approve the login link; the device `ikan` appears in your tailnet.
4. Share only the `ikan` machine with each tester (Machines > ikan > Share). They install Tailscale, accept the invite and open `https://ikan.<your-tailnet>.ts.net`. They cannot reach anything else on your server.

## Channels

| Branch | Who | Server image | Android app | APK release |
| --- | --- | --- | --- | --- |
| `beta` | Beta testers | `ghcr.io/lostsubject18/ikan:latest` (and `:beta`) | Ikan Quests (`io.github.lostsubject18.ikan`) → `https://ikan.tail76472d.ts.net` | `android-latest` |
| `alpha` | Development | `ghcr.io/lostsubject18/ikan:alpha` | Ikan Alpha (`io.github.lostsubject18.ikan.alpha`, installs next to the beta) → `https://ikan-alpha.tail76472d.ts.net` | `android-alpha` |

Work happens on `alpha`. To ship to the testers, merge `alpha` into `beta` and push; then force-update the `ikan` container on Unraid.
Beta releases are tagged (`v0.1.0-beta.1`, ...).

## Docker Compose

    docker compose up -d --build

Then open `http://SERVER-IP:3000`. Data is stored in `./data`.

## Configuration

| Variable             | Default | Meaning                                                  |
|----------------------|---------|----------------------------------------------------------|
| `PORT`               | `3000`  | Port inside the container                                |
| `DATA_DIR`           | `/data` | Where the database is stored                             |
| `ALLOW_REGISTRATION` | `false` | `true` lets anyone create an account on the sign-in page |

## Guilds and shared quest boards

- Open the shield button (bottom left) to create a guild. The guild shows an invite code; anyone with an account **on the same server** can join with it.
- Open a quest board and press **Share** (top right of the board's edit window) to share it with one of your guilds. Every member then sees the board and can add, edit and finish its quests. Edits are merged quest by quest, so several people can work at the same time (the app checks for changes every 15 seconds).
- The "active" flag stays personal; it is not shared.
- Completing or burning a shared quest removes it from the board for everyone. Your own history stays yours.
- **Shared XP:** finishing a quest on a shared board gives XP to you (as usual), to the board (its level bar is the same for every member) and to the guild. Undoing a completion in your history takes the XP back. Completions are queued and sent when the server is reachable, so nothing is lost offline.
- **Leaderboard:** open the shield button: each guild shows its level bar and a Top 3 with your own rank. Tap a guild to see its shared quest boards; the guild owner gets a ⚙️ button there to decide whether members may create invite codes and share quest boards (by default members may share boards but not renew the code). In the same options window the owner can rename the guild and give it a color, pattern and emoji, just like a quest board. *All members* lists everyone, with the invite code. Tap the overall level in the header for your profile (name, level, last completed quests, ash pile, account settings). Tap a guild's level bar to see every quest finished in the guild. Members are ranked by their share of the guild's XP; each row shows the number of finished quests (tap it to see every quest that member finished) and their percentage of the guild's XP. Former members' XP still counts for the guild.
- Stop sharing, leave a guild or delete a guild: everyone keeps a personal copy of the board. The guild owner can remove members and renew the invite code. If the owner leaves, the guild passes to the longest-standing member.
- Deleting a shared board as someone other than its owner only removes it for you.

## Quest boards

Press and hold a quest board (on its title or empty area) for half a second, then drag it to a new place to change the order. Quests can be reordered the same way: hold a quest card and drag it within its board, or within the *Active quests* list. The order of a shared board is shared with the guild.

## Notes

- Expose the server to the internet only behind HTTPS (a reverse proxy such as Caddy or Nginx Proxy Manager) or use a VPN such as Tailscale.
- The first person to open a fresh server claims the admin account, so set it up before exposing the server.
- Forgot a password: the admin resets it in the user menu. If the admin is locked out, delete `ikan.db` (all data is lost) or edit it with SQLite.
- The font "Nunito" is loaded from Google Fonts; without internet access a system font is used.

## Try it without Docker

- **In the browser:** the published demo build of the app runs a tiny copy of the server inside the page. Create accounts (sign out to switch users), create a guild, share a board, and use *Add demo friends* in the guild window to fill the leaderboard. Everything stays in that browser; *Reset demo* in the top bar wipes it.
- **On your computer:** with Node 22.13 or newer, run `DATA_DIR=./data PORT=3000 ALLOW_REGISTRATION=true node server.js` in this folder and open http://localhost:3000. Open a second private window to be a second user.

## Development

    node server.js        # needs Node 22.13+; set DATA_DIR=./data for local runs

The web app is a single file, `public/index.html`, plus `public/sync.js`, which adds login and server sync.
