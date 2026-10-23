# Study Assistant (static site for GitHub Pages)
Pure HTML/CSS/JS. No build step, no server, no database. All files are in one flat folder; `index.html` is the entry page and every link is relative, so it works at `https://USERNAME.github.io/REPO/`.

**Files:** 8 pages (`index`, `study-materials`, `practice`, `study-tools`, `admission`, `study-planner`, `english`, `help` .html), `style.css`, `core.js` (helpers, storage, backup), `tools.js` (calculator, converter, timer, stopwatch), `study.js` (quiz, planner, notes, flashcards, checklist), `favicon.svg`.

## Upload from an Android phone
1. Open **Files by Google**, tap the ZIP, choose **Extract**.
2. In Chrome go to github.com, sign up or sign in. If buttons are missing, Chrome menu → **Desktop site**.
3. **+ → New repository**: name it (e.g. `study-assistant`), choose **Public**, tap **Create repository**.
4. Tap **uploading an existing file**, pick all extracted files (select many at once; no folders exist), wait for upload, tap **Commit changes**.
5. **Settings → Pages → Build and deployment**: Source **Deploy from a branch**, Branch **main**, folder **/ (root)** → **Save**.
6. Wait 1–3 minutes, reload Settings → Pages for your link: `https://USERNAME.github.io/study-assistant/`.
To update later: open a file → pencil icon, or upload files again with the same names.

## What is stored where
Nothing syncs automatically. Data lives in the browser's `localStorage` (keys prefixed `sa:`), separate per browser/device and per web address (the website and a future app will not share it).
| Key | Content | Needs backend to share? |
|---|---|---|
| `sa:tasks` | planner tasks `{id,t,s,m,p,d,dn}` | Yes |
| `sa:quiz` | last 20 attempts `{d,s,n,c,sec}` | Yes |
| `sa:bm` | bookmarked note ids | Yes |
| `sa:focus` | `{date: completed sessions}` | Yes |
| `sa:known`, `sa:ck` | flashcards known, admission checklist | Yes |
Notes, questions and vocabulary are sample data inside the HTML/`study.js`. Manual transfer: Help page → Download/Restore backup.
To get real sync later you need a backend (for example Supabase or Firebase) with authentication and per-user access rules; replace the `DB` object in `core.js` with API calls. Not implemented.

## Future Android app guide
Option A, Capacitor (wraps this site in a WebView):
1. Install Node.js LTS and Android Studio (includes the SDK and a JDK) on a computer.
2. `npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android`
3. `npx cap init "Study Assistant" com.yourname.studyassistant --web-dir=www`; copy all site files into `www/`.
4. `npx cap add android`, then after each change `npx cap sync`, then `npx cap open android`.
5. Test on an emulator and a real phone (USB debugging) at several screen sizes; check back button, offline start, timer behaviour when the app is backgrounded, and that the backup download/restore works (may need Capacitor Filesystem/Share plugins).
6. Add icon and splash (`@capacitor/assets`), set version code/name.
7. Signing: create an upload keystore (Android Studio → Build → Generate Signed Bundle/APK, or `keytool`); back it up and never commit it. Build a signed **AAB** and enrol in Play App Signing.
8. Publish: Google Play Console developer account (one-time fee, identity verification). Prepare a privacy-policy URL, Data safety form, content rating, 512×512 icon, 1024×500 feature graphic and screenshots. Check Google's current rules for the required target API level and testing requirements for new personal accounts before launch.
Option B: rebuild natively (Kotlin/Jetpack Compose or Flutter), reusing the data shapes above and a shared backend API.
Native features (push notifications, offline sync, file access) need plugins or native code. Check current Capacitor, Android Studio and Play documentation, since requirements change.
