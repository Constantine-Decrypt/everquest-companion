# EQ Legends Companion

A Windows desktop companion for **EverQuest Legends**. It reads the log file the game
already writes and turns it into live, useful views — a DPS meter, floating overlays,
quest and loot tracking, alerts.

**It only reads your log.** Nothing is injected into EverQuest, no game files are
touched, no memory is read, and nothing is automated or played for you. If you turned
off logging, the app simply has nothing to show.

## What it does

- **Live DPS meter** — per-fight and per-zone numbers with fight history, drill-down
  into each attack and spell, and a timeline of the pull.
- **Floating overlays** — small always-on-top meters you can leave on top of the game:
  damage or healing, scoped to the current fight or the whole zone. Lock one and it
  becomes click-through.
- **Plane of Sky tracker** — every class's Test quests with "have / need" chips per
  item, item stats on hover, and sorting by closest-to-done.
- **Loot + item knowledge** — a running history of what you looted, and what each item
  is actually *for*: which quests use it, what it turns in for, which recipes consume it.
- **Leveling & AA** — XP and AA progress per character, with history.
- **Raid targets** — which named/raid mobs you've killed and when.
- **Buff timers** — remaining time on buffs, learned from the log *(early — still rough)*.
- **Sound alerts** — play a sound when something happens: a charm break, a buff fading,
  a raid target dying, or any log line you write a rule for. Voice packs included.

Everything is per-character; switch characters and the app re-reads that log.

## Getting started

**Requires 64-bit Windows 10 or 11.** Windows 8.1 and older can't run it — the installer
checks and stops with a message rather than leaving you an app that won't start.

1. Download `everquest-companion-Setup-<version>.exe` from the
   [**Releases**](https://github.com/Constantine-Decrypt/everquest-companion/releases) page.
2. Run it. It's a one-click, per-user install (like Discord) — no admin prompt, no
   wizard. It adds a Start-menu and desktop shortcut.
3. In EverQuest, type `/log on`.

The app finds your log automatically — usually
`C:\Users\Public\Daybreak Game Company\Installed Games\EverQuest Legends\Logs\`. If your
install lives somewhere else, point it at the right folder in **Settings**.

Overlays sit on top of the game in **windowed** or **borderless** mode. Exclusive
fullscreen can't be overlaid by anything, so use borderless if you want them.

### Code signing

The installer is code-signed as **Joshua Moyers** through Microsoft's Artifact
Signing service, and auto-updates are verified against that signature before they
install. If SmartScreen still shows a "Windows protected your PC" warning while
the certificate is new, click **More info**, then **Run anyway** — you only ever
see it once.

### Already have an old `eq-tools` install?

The app was renamed from `eq-tools` to `everquest-companion`, which Windows treats as a
different app — the new installer will *not* replace the old one, and the old install
will never auto-update again. Uninstall **eq-tools** once from Settings → Apps, then run
the new installer. Your settings, alerts and sound packs carry over automatically on
first launch (the old folder is left in place, untouched, as a backup).

### Development release — v1.16.1-dev.3

**Latest development release:** [v1.16.1-dev.3](https://github.com/Constantine-Decrypt/everquest-companion/releases/tag/dev-v1.16.1-dev.3)

This development edition includes Electron security hardening, dependency
security updates, and separate Windows development packaging. It is maintained
independently from the standard application.

**Windows 10/11 (64-bit) downloads:**

- **Installer:** [everquest-companion-DEV-Setup-1.16.1-dev.3.exe](https://github.com/Constantine-Decrypt/everquest-companion/releases/download/dev-v1.16.1-dev.3/everquest-companion-DEV-Setup-1.16.1-dev.3.exe)
- **Portable:** [everquest-companion-DEV-Portable-1.16.1-dev.3.exe](https://github.com/Constantine-Decrypt/everquest-companion/releases/download/dev-v1.16.1-dev.3/everquest-companion-DEV-Portable-1.16.1-dev.3.exe)

#### Security improvements

**Electron sandboxing and renderer isolation**

- Electron renderer sandboxing is enabled with `sandbox: true`.
- Context isolation is enabled with `contextIsolation: true`.
- Node.js integration is disabled in renderer pages, workers, and subframes.
- Web security and same-origin enforcement remain enabled.
- Insecure mixed content is disabled.
- Webviews and drag-and-drop navigation are disabled.
- Experimental Chromium features are disabled.
- Preload scripts expose application functionality through Electron's
  `contextBridge` and `ipcRenderer` rather than direct renderer Node.js access.

**Additional application hardening**

- Navigation and new-window creation are restricted by centralized
  web-contents security policies.
- Webview attachment attempts are blocked.
- Application session permissions are denied by default.
- Content Security Policy (CSP) restricts executable content.
- Security-related window preferences are centralized to reduce
  configuration drift between application windows.

**Dependency security**

- Development dependencies were updated to address reported vulnerabilities.
- The deprecated `encoding` dependency was removed.
- The vulnerable `global-agent` dependency was replaced.
- `npm audit` reported zero vulnerabilities when dev3 was built.

#### Development release history

| Version | Changes |
| --- | --- |
| **v1.16.1-dev.1** | Introduced the Electron sandbox/security work, separate development packaging, and a portable Windows executable. |
| **v1.16.1-dev.2** | Updated dependencies and removed the deprecated `encoding` package. |
| **v1.16.1-dev.3** | Replaced the vulnerable `global-agent` dependency, completed additional dependency cleanup, and published updated development executables. |

The sandbox and renderer hardening were introduced earlier in the development
series; they are not new features introduced by dev3 alone.

#### Installation, signing, and updates

- The development edition uses a separate application identity from the
  standard release.
- The installer installs **EQ Legends Companion Dev**.
- The portable executable runs without the normal installation process.
- **Both dev3 executables are unsigned.** Windows SmartScreen may display
  an unknown-publisher warning.
- Development builds do not use the standard application's automatic-update
  configuration. The automatic-update instructions below describe the
  standard application, not this development edition.
- No gameplay feature changes were intended as part of the dev3 dependency
  security update.
## Updates

The app updates itself in the background from GitHub Releases. When a new version has
downloaded, an **"Update ready"** notice appears with a **Restart** button — click it to
apply now, or it installs the next time you quit.

## Make it yours

- **Sound & voice packs.** Alert sounds come from packs. One voice pack ships with the
  app and installs itself on first launch, and you can browse and install ~350 more from
  inside the app (**Alerts → Sound packs…**). To add your own: drop a folder into
  `%AppData%\everquest-companion\soundpacks\<your-pack>\` containing your `.wav`/`.mp3`/`.ogg`
  files and a small `manifest.json` naming them — it shows up in every sound picker. Want
  your own Final Fantasy fanfare on a raid kill? That's the whole job.
- **Share alerts.** Any alert (or all of them at once) copies to a short paste-safe
  string. Drop it in guild chat or Discord; whoever pastes it back in gets a preview
  before anything is added. Imports only ever *add* — they never overwrite your alerts.
- **Share your setup.** Export your whole settings bundle — alerts, volume, overlay
  look, view preferences, favorites — as one string or a file. It carries no file paths,
  no window positions, and no character progress.

## Feedback

EQ Legends Companion uses GitHub Issues for bug reports, feature requests, and general feedback.

Select **Send feedback** in the application to open the GitHub Issues page in your browser. You can describe a problem, suggest an improvement, or request a new feature.

**[Submit feedback or report a bug](https://github.com/Constantine-Decrypt/everquest-companion/issues/new)**

The application no longer submits feedback to the previous AWS feedback service. It does not automatically upload EverQuest logs, system diagnostics, or feedback attachments.

If you choose to include a log excerpt, screenshot, or other information in a GitHub issue, review it before posting. GitHub issues in a public repository are publicly visible.

### Usage analytics and telemetry

Anonymous usage analytics and automatic error-report uploads are disabled.

The previous AWS telemetry service no longer starts, and the application does not send telemetry events to that endpoint.

The former **Usage analytics** setting and first-run telemetry notice have been removed.

[`TELEMETRY.md`](TELEMETRY.md) documents the legacy telemetry event schema retained in the source code. These definitions do not mean the application currently collects or uploads those events.

See [`SECURITY.md`](SECURITY.md) for additional security and privacy information.

## Development

Contributions welcome. Everything about building, testing, and the architecture lives in
[`AGENTS.md`](AGENTS.md) — start there.

## License

FSL-1.1-MIT (Functional Source License, converting to MIT after two years) — see
[`LICENSE`](LICENSE). Copyright (c) 2026 Josh Moyers.

## Thanks

The item icons and raid-boss portraits this app draws come from two volunteer-run
EverQuest wikis — [**wiki.project1999.com**](https://wiki.project1999.com/) (boss
portraits) and [**eqlwiki.com**](https://eqlwiki.com/) (item icons, and the item, spell
and quest knowledge behind them). Those images are **copied into the app at build time**
(`resources/wiki-images/`, ~3.75 MB, regenerated with `npm run fetch:images`), so the
running app never asks either site for a picture, and
[`resources/wiki-images/manifest.json`](resources/wiki-images/manifest.json) records the
exact source URL, byte length and SHA-256 of every file it ships. Neither wiki is
affiliated with this app. The same credit is in the app itself, under
**Preferences → Thanks**.

The bundled **Alan Rickman** voice pack comes from
[utensils/openpeon-alan-rickman-soundpack](https://github.com/utensils/openpeon-alan-rickman-soundpack)
and is licensed CC-BY-4.0. Packs you install from the in-app browser carry their own
licenses and attribution (see each pack's manifest); none of them are part of this
repository.
