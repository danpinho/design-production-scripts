# design-production-scripts

Small scripts that take the repetitive work out of design production — renaming exports, setting up documents, formatting pasted content, and other things that shouldn't require manual effort.

Built for InDesign, Illustrator, and macOS.

## Structure

| Folder | Description |
|--------|-------------|
| `indesign/` | Adobe InDesign scripts (ExtendScript/JSX) |
| `illustrator/` | Adobe Illustrator scripts (ExtendScript/JSX) |
| `macos/` | macOS automation scripts (Python, shell) |

## Scripts

### InDesign

| Script | Description |
|--------|-------------|
| [`indesign/rename-by-week.py`](indesign/rename-by-week.py) | Renames InDesign exports sequentially by ISO week number for social media scheduling |
| [`indesign/apply-markdown.jsx`](indesign/apply-markdown.jsx) | Converts pasted Markdown text (e.g. from LLM output) into InDesign paragraph and character styles, including table conversion |
| [`indesign/xml-tags-to-styles.jsx`](indesign/xml-tags-to-styles.jsx) | Creates matching paragraph styles from all XML tags in the document — useful for bootstrapping an XML import workflow |
| [`indesign/setup-layers.jsx`](indesign/setup-layers.jsx) | Sets up a standardized layer structure (Images, Vectors, Text) with assigned colors, renaming default layers if present |
| [`indesign/export-web-print.jsx`](indesign/export-web-print.jsx) | Exports two PDFs at once — web-optimized for client delivery and high-res for print and mockup placements |
| [`indesign/restructure-xml.py`](indesign/restructure-xml.py) | Restructures an XML file for InDesign import by extracting category values from rows into standalone elements |

### Illustrator

| Script | Description |
|--------|-------------|
| [`illustrator/setup-layers.jsx`](illustrator/setup-layers.jsx) | Sets up Black and White layers for brand/logo documents, removes the default layer, and sets Black as active |
| [`illustrator/export-layers.jsx`](illustrator/export-layers.jsx) | Saves each layer as a separate .ai file named after the document and layer |
| [`illustrator/export-print.jsx`](illustrator/export-print.jsx) | Exports EPS, SVG, and PDF into separate subfolders next to the source file |
| [`illustrator/export-web.jsx`](illustrator/export-web.jsx) | Exports SVG and high-res PNG (300 DPI, transparent) into separate subfolders next to the source file |

