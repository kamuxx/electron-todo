# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-02-25

### Fixed
- Corrected `electron-updater` import: replaced non-existent `appUpdater` export with the official ESM-compatible destructuring pattern via `electronUpdater` default import.
- Replaced invalid `app.on('check-for-updates')` (not a real Electron event) with the correct `autoUpdater.on('checking-for-update')` event listener.

### Added
- Added `electron-log` integration for logging update check events in the main process.
- Added `getAutoUpdater()` helper function using the official ESM workaround for `electron-updater` CommonJS compatibility.
- Added IPC message `update-available` sent to renderer when a new version is detected.
- Added `checkUpdate()` async function returning `UpdateCheckResult | null` with null-guard.
- Added `UpdateApp()` function with null-guard on `autoUpdater` initialization.

### Changed
- Renamed npm scripts: `dev:ui` → `start:ui`, `dev:main` → `start:main` for naming consistency.
- Bumped version to `1.2.0`.

---

## [1.1.0] - 2026-02-24

### Added
- Added `electron-builder` configuration with NSIS installer target for Windows (x64, ia32).
- Added `electron-log` and `electron-updater` as production dependencies.
- Added GitHub publish configuration (`provider: github`, `owner: kamuxx`, `repo: electron-todo`).
- Added custom application icon (`assets/logo.ico`) for the Windows installer.

### Changed
- Set `nsis.oneClick: false` to enable the installation wizard.

---

## [1.0.0] - 2026-02-19

### Added
- Initial project setup with Electron, React, TypeScript, Tailwind CSS v4 and Vite.
- Main process entry point (`main.ts` → `src/app.ts`) with `BrowserWindow` creation.
- Renderer process with React 19 and Tailwind v4 via `@tailwindcss/vite` plugin.
- Preload script (`preload.ts`) as a secure bridge between Main and Renderer processes.
- Custom TypeScript types for `BrowserWindowOptions` (`src/types/browser.ts`).
- `concurrently` setup to run Vite and Electron simultaneously in development.
- Full project documentation in `docs/setup.md`.
