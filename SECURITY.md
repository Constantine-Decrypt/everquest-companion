# Security

EQ Legends Companion is a desktop app that reads your EverQuest log file and shows
you what happened. This document is an honest description of what it touches, what
it does not, and how you can verify that the copy you installed is the one we built.

## Reporting a vulnerability

Security vulnerabilities should be reported privately rather than through public GitHub issues.

Email **[rynets@gmail.com](mailto:rynets@gmail.com)** with a description of the vulnerability and steps to reproduce it.

You can also use [GitHub's private vulnerability reporting](https://github.com/Constantine-Decrypt/everquest-companion/security/advisories/new) if that feature is enabled for the repository.

Please avoid including passwords, access tokens, or other sensitive information in your report.

This is an independently maintained project. There is no bug bounty or guaranteed response time.

## What the app touches

**On your machine**

| Thing                                              | Access                                 |
| -------------------------------------------------- | -------------------------------------- |
| Your EverQuest log file(s)                          | **read-only**, parsed locally and never modified. Not automatically uploaded or attached to feedback reports. |
| `%APPDATA%\everquest-companion\`                    | read/write — your settings and progress |
| `%LOCALAPPDATA%\Programs\everquest-companion\`      | the install directory                   |
| Windows registry (`HKCU`, uninstall entry)          | written by the installer only           |

The app installs **per-user**. It never asks for administrator rights, and there is
no UAC prompt at install, update, or uninstall time — the installer is built with
`perMachine: false`, so it has no elevation manifest at all.

Your EverQuest log files are opened read-only and parsed locally.
The application does not automatically upload EverQuest logs or attach
log excerpts to feedback reports.

Feedback and bug reports are submitted through GitHub Issues in your
browser. You decide what information to include when creating an issue.

**Over the network** — all HTTPS. Everything the app does on its own from a
third-party host is a read-only GET:

| Host                                             | Why                                                   |
| ------------------------------------------------ | ----------------------------------------------------- |
| `github.com` / `objects.githubusercontent.com`   | update checks and installer downloads                  |
| `wiki.project1999.com`                           | item lookups + item icons                              |
| `eqlwiki.com`                                    | item lookups + item icons                              |
| `peonping.github.io`, `raw.githubusercontent.com`| the optional sound-pack registry and pack downloads     |

**Previous AWS feedback and telemetry services**

Earlier versions of EQ Legends Companion used AWS services for feedback
submissions, anonymous usage analytics, and optional bug-report log attachments.

In the current development build, these services are disabled:

- Feedback now opens GitHub Issues instead of using the AWS feedback API.
- Anonymous usage analytics and telemetry uploads are disabled.
- Automatic error-report uploads are disabled.
- Bug-report log attachments are no longer uploaded to AWS S3.

The previous AWS integration code and infrastructure definitions may still
exist in the repository, but the application no longer starts these services.

Disabling these services does not automatically delete data that may have
been stored by earlier versions.

Remote images are fetched only from an exact hostname allowlist
(`wiki.project1999.com`, `eqlwiki.com`), HTTPS only, default port only, no embedded
credentials, and are cached on disk after content sniffing.

## What the app never does

- No account or login is required to use the application.
- **No automatic telemetry uploads.** Anonymous usage analytics,
  session activity reports, and automatic error-report uploads are disabled.
- **No automatic EverQuest log uploads.** Log files are read locally
  and are not automatically attached to feedback or bug reports.
- **No AWS feedback submissions.** Feedback now opens GitHub Issues
  in your browser, where you choose what information to submit.
- The application does not write to, inject into, or otherwise
  modify the EverQuest client.
- The application does not run with administrator privileges.
- The application does not accept an update feed URL from settings,
  the UI, or a file on disk. The update source is compiled in.


## Usage analytics

Anonymous usage analytics and automatic telemetry uploads are disabled
in the current development build of EQ Legends Companion.

The application no longer starts the previous AWS telemetry service.
It does not transmit usage events, session activity reports, or
automatic error reports to the former AWS telemetry endpoint.

The previous first-run telemetry notice and Preferences usage analytics
switch have been removed because telemetry uploads are disabled.

[`TELEMETRY.md`](TELEMETRY.md) documents the legacy telemetry event
schema retained in the source code. The event definitions are historical
technical documentation and do not represent active data collection.

### Historical AWS telemetry data

Earlier versions of the application could transmit anonymous usage
analytics to AWS infrastructure.

Disabling telemetry in the current application does not automatically
delete information collected by earlier versions or stored in AWS
databases, logs, or backups.

The status and retention of historical AWS data must be verified
separately before making any claims about its deletion.

## Feedback and untrusted content

Feedback and bug reports are submitted through GitHub Issues in your
browser rather than through the previous AWS feedback API.

The application does not automatically attach EverQuest log files,
system diagnostics, or screenshots to GitHub issues.

When submitting a GitHub issue, review the information you choose
to include. Issues in a public repository can be viewed by anyone.

The previous AWS feedback ingestion, S3 attachment upload, and
telemetry validation code may remain in the source repository for
historical or development purposes. These services are not started
by the current application.

Content retrieved from external sources must still be treated as
untrusted. The application should validate external data and
avoid executing content obtained from remote services.

## How updates are verified today

1. The app polls **only** the GitHub Releases of this repository, over HTTPS. The
   feed location is fixed at build time (`electron-builder.yml`); nothing in the
   settings store or the renderer process can point it elsewhere.
2. The feed (`latest.yml` / `main.yml`) carries a **SHA-512** for the installer.
   `electron-updater` streams the download through a digest transform and aborts
   with `ERR_CHECKSUM_MISMATCH` on any mismatch. The same check is applied to
   differential (block-map) downloads and re-applied to an already-staged
   installer before it is ever run.
3. Downgrades are refused (`allowDowngrade = false`), so a re-published or
   rolled-back release cannot walk an installation backwards.
4. Every release also ships **`SHA256SUMS.txt`** so you can verify a manual
   download yourself, independently of GitHub's TLS:

   ```powershell
   certutil -hashfile everquest-companion-Setup.exe SHA256
   ```

   ```sh
   sha256sum -c SHA256SUMS.txt
   ```

## Code signing and the update trust chain

**Release builds are code-signed** ("Joshua Moyers", via Azure Artifact Signing;
CI injects the signing arguments on tagged releases — see `.github/workflows/`).
Two consequences:

1. SmartScreen: signed installers should not warn. If a warning appears while the
   certificate's reputation is new, *More info → Run anyway* — and the signature
   details on the exe are checkable either way (right-click → Properties →
   Digital Signatures).

2. The update path: `electron-updater` verifies more than transport integrity.
   Every download is checked byte-for-byte against the sha512 in the release
   feed, AND (because `publisherName` is set in electron-builder.yml) the
   downloaded installer's Authenticode publisher must match "Joshua Moyers" or
   the update fails with `ERR_UPDATER_INVALID_SIGNATURE` before anything runs.
   A compromised GitHub account alone is therefore no longer sufficient to ship
   a malicious update to existing installs: the attacker would also need the
   Azure signing identity. (Historical note: builds before v0.1.8 were unsigned
   and did not verify publisher identity; they will update to signed builds,
   and from then on the verification applies.)

- **Release-pipeline hardening.** CI publishes only from a pushed `v*` tag;
  only that one job holds a repository-write token (every other path runs read-only);
  all third-party GitHub Actions are pinned to commit SHAs; dependency install
  scripts are disabled (`.npmrc`, `ignore-scripts=true`) so a compromised npm
  package cannot execute code inside the release job.

For out-of-band certainty about a specific download, check it against
`SHA256SUMS.txt` on the release page and against the hash printed in the public
build log for that tag.

## Supply chain

- Dependencies are installed with `npm ci` from a committed lockfile; every entry
  carries a `sha512` integrity hash and resolves to `registry.npmjs.org`.
- `ignore-scripts=true` — no dependency's install hook executes on a developer
  machine or in CI. See `.npmrc`.
- All GitHub Actions are pinned to full commit SHAs, not mutable tags.
- Dependabot watches npm and Actions weekly (`.github/dependabot.yml`).
- The tree currently reports **zero** known vulnerabilities — `npm audit` and
  `npm audit --omit=dev` both say `found 0 vulnerabilities`. See
  [Known dependency advisories](#known-dependency-advisories) for why the plain
  `npm audit` number is the one that matters here.

## Known dependency advisories

**There are none open right now.** This section exists to say how they are judged
when there are, because the default reading of the numbers is wrong for this
project in one specific way.

**`--omit=dev` is not the runtime.** npm and Dependabot classify a package by
which block of `package.json` it sits in, and `electron` sits in
`devDependencies` — that is correct for how it is *installed* (it is not
`require`d from the packaged app's `node_modules`; it *is* the packaged app). The
consequence is that `npm audit --omit=dev` hides every Chromium advisory in the
thing users actually run. So the number quoted above is the plain `npm audit`,
and an electron advisory is treated as a **shipping** vulnerability regardless of
which block it was found in. `vite`, `esbuild`, `electron-builder` and friends
genuinely are build-time only: nothing they contain is copied into the installer.

**Electron is held to the supported line, not to the minimum patch.** Electron
takes Chromium security fixes on the newest three majors only. Pinning to the
exact version an advisory names would park us on a line that has stopped
receiving them, so the target is the current supported major even when that is a
larger jump. Majors are still hand-driven (`.github/dependabot.yml` ignores
`electron` / `electron-builder` majors on purpose) and are verified by building
and packaging, not by reading a changelog: `npm test`, `npm run test:e2e`
against a real boot, and `npm run dist:dir` through to a launchable
`win-unpacked`.

**Unreachable is stated, not assumed.** Where an advisory does not apply, the
reason is written down with the fix rather than used to skip it — for example
`GHSA-7g7r-gx96-252g` (`app-builder-lib`) is an `AppImage` `AppRun` bug, and
`electron-builder.yml` builds exactly one target, Windows `nsis` `x64`. It was
upgraded anyway. "Not reachable" is a note in the commit, not a reason to leave
a version behind.

## Scope

In scope: anything that lets someone else read your data, run code on your machine
through this app, or tamper with an update. Out of scope: SmartScreen warnings on
unsigned builds (known, documented above), and anything requiring an attacker who
already has code execution on your machine.
