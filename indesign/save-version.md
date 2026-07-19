# save-version

Freezes the current state of the open InDesign document as a numbered
version — one click instead of five manual steps. The script implements the
versioning convention from the internal SOP "Arbeitsdateien versionieren":
the working file in the project root keeps its name and stays open; versions
are created as copies next to it.

## What the script does

One run, in this order:

1. **Saves** the open document.
2. **Determines the next free version number** — it scans `Versionen/` for
   existing `-vNN` files of this document and counts up by one.
3. **Copies** the file to `Versionen/<name>-vNN.indd`.
4. **Exports** `PDFs/<name>-vNN.pdf` with a selectable PDF export preset.
5. **Confirms** the result in a dialog.

Example — document `0001-26001.indd`, third version:

```
0001-26001/
    0001-26001.indd                  ← stays open, keep working here
    Versionen/0001-26001-v03.indd    ← new
    PDFs/0001-26001-v03.pdf          ← new, identical state as the v03.indd
```

Snapshot and PDF are created in the same moment — the `.indd` version and the
PDF sharing a number are therefore guaranteed to be the same state.

## Installation

1. Put `save-version.jsx` into InDesign's Scripts Panel folder
   (Window → Utilities → Scripts → right-click "User" → "Reveal in Finder").
2. Optional, recommended: assign a keyboard shortcut under
   Edit → Keyboard Shortcuts → product area "Scripts".

## Usage

Keep the document open and run the script — double-click it in the Scripts
panel or use the keyboard shortcut. Pick the PDF preset in the dialog:

- The list shows all PDF export presets defined in InDesign.
- **"Web"** is preselected if present (case-insensitive) — the same presets
  as used by `export-web-print.jsx`.
- **"Export"** saves the version and the PDF.
- **"No PDF"** saves the version only, without exporting.

The `Versionen/` and `PDFs/` folders are created automatically if missing.
Afterwards simply continue working in the working file — it was neither
renamed nor closed.

## Safeguards

- **Never-saved documents** are refused — save into the project root first,
  then version.
- **Documents inside the `Versionen/` folder** are refused: anyone who
  accidentally opened an old state cannot re-version it. Only the working
  file in the project root gets versioned.
- **Unexpected filenames** (not matching a project-number pattern like
  `0001-26001.indd`) trigger a confirmation but don't block.
- **Existing versions are never overwritten** — on a collision the script
  aborts.

## Related

- SOP "Arbeitsdateien versionieren":
  `34 Konventionen/sop-arbeitsdateien-versionieren.md` (internal) — the rules
  this script implements
- `export-web-print.jsx` — web and print PDF in one run, same PDF presets
