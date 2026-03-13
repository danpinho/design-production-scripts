# design-production-scripts

Small scripts that take the repetitive work out of design production — renaming exports, setting up documents, formatting pasted content, and other things that shouldn't require manual effort.

Built for InDesign, Illustrator, and macOS.

## Structure

| Folder | Description |
|--------|-------------|
| `indesign/` | Adobe InDesign scripts (ExtendScript/JSX) |
| `illustrator/` | Adobe Illustrator scripts (ExtendScript/JSX) |
| `macos/` | macOS automation scripts (Python, AppleScript) |
| `general/rename/` | File renaming utilities |
| `general/data/` | Data format conversion and cleanup |
| `general/media/` | Image metadata tools |

## Scripts

### InDesign

| Script | Description |
|--------|-------------|
| [`indesign/rename-by-week.py`](indesign/rename-by-week.py) | Renames InDesign exports sequentially by ISO week number for social media scheduling |
| [`indesign/apply-markdown.jsx`](indesign/apply-markdown.jsx) | Converts pasted Markdown text (e.g. from LLM output) into InDesign paragraph and character styles, including native table conversion with applied paragraph and table styles |
| [`indesign/xml-tags-to-styles.jsx`](indesign/xml-tags-to-styles.jsx) | Creates matching paragraph styles from all XML tags in the document — useful for bootstrapping an XML import workflow |
| [`indesign/setup-layers.jsx`](indesign/setup-layers.jsx) | Sets up a standardized layer structure (Images, Vectors, Text) with assigned colors, renaming default layers if present |
| [`indesign/export-web-print.jsx`](indesign/export-web-print.jsx) | Exports two PDFs at once — web-optimized for client delivery and high-res for print and mockup placements |
| [`indesign/restructure-xml.py`](indesign/restructure-xml.py) | Restructures an XML file for InDesign import by extracting category values from rows into standalone elements |

### Illustrator

| Script | Description |
|--------|-------------|
| [`illustrator/setup-layers.jsx`](illustrator/setup-layers.jsx) | Sets up Primary, Black, and White layers for brand/logo documents, removes the default layer, and sets Primary as active |
| [`illustrator/colorize-layers.jsx`](illustrator/colorize-layers.jsx) | Duplicates artwork from Primary to Black and White layers, applying the respective CMYK fill color to each copy |
| [`illustrator/export-layers.jsx`](illustrator/export-layers.jsx) | Saves each layer as a separate .ai file named after the document and layer |
| [`illustrator/export-print.jsx`](illustrator/export-print.jsx) | Exports EPS, SVG, and PDF into separate subfolders next to the source file |
| [`illustrator/export-web.jsx`](illustrator/export-web.jsx) | Exports SVG and high-res PNG (300 DPI, transparent) into separate subfolders next to the source file |

### macOS

| Script | Description |
|--------|-------------|
| [`macos/create_folders.py`](macos/create_folders.py) | Creates a folder hierarchy from a Markdown list — each `- item` becomes a folder, indentation (2 spaces) defines nesting |

### General — Rename

| Script | Description |
|--------|-------------|
| [`general/rename/rename-by-csv.py`](general/rename/rename-by-csv.py) | Renames files in a folder based on a CSV mapping with `original_file` and `filename` columns — skips missing files and name conflicts |

### General — Data

| Script | Description |
|--------|-------------|
| [`general/data/csv-to-xml.py`](general/data/csv-to-xml.py) | Converts a CSV file to XML — each row becomes a `<Row>` element with child elements per column, UTF-8 encoded |
| [`general/data/restructure-xml.py`](general/data/restructure-xml.py) | Restructures XML by extracting `Kategorie` values to standalone elements while flattening rows into the parent `<Story>` |
| [`general/data/excel-titlecase.py`](general/data/excel-titlecase.py) | Converts a specified column in an Excel file to title case and saves the result as a new file |

### General — Media

| Script | Description |
|--------|-------------|
| [`general/media/image-exif-description.py`](general/media/image-exif-description.py) | Reads a CSV with `filename` and `description` columns and writes the description into the EXIF metadata of each image |
