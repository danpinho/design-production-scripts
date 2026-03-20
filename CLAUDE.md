# Scripts Repo

Small scripts for design production — InDesign, Illustrator, macOS automation (AppleScript), and general utilities.

## Skills

This repo has three Claude Code skills in `.claude/skills/`:

- **script-conventions** — Naming, folder structure, and README rules for this repo. Use whenever scripts are added, moved, renamed, or organized.
- **datei-konventionen** — German-language file and folder naming conventions (kebab-case, ISO dates, versioning, umlaut replacement). Use for any file/folder naming task in a German office context.
- **ordner-struktur** — Folder structures based on the Johnny Decimal System. Use for any folder hierarchy task — organizing drives, NAS, project structures. Includes templates in `reference/`.

The two German skills complement each other: `ordner-struktur` handles the folder hierarchy (JD numbering), `datei-konventionen` handles everything about the file names inside those folders.

## Repository

This repo is public on GitHub. Keep it clean: no clutter, no temporary files, no half-finished work committed.

## Conventions

- All script filenames use **kebab-case** (lowercase, hyphens, no underscores or spaces)
- Top-level folders map to the target tool/environment: `indesign/`, `illustrator/`, `macos/` (AppleScript only), `general/` (cross-platform Python)
- Every script must have a matching entry in `README.md`
- Never commit a script without its README entry, or vice versa
