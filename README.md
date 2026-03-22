# design-production-scripts

Small scripts that take the repetitive work out of design production — renaming exports, setting up documents, formatting pasted content, and other things that shouldn't require manual effort.

Built for InDesign, Illustrator, and macOS.

## Structure

| Folder | Description |
|--------|-------------|
| `indesign/` | Adobe InDesign scripts (ExtendScript/JSX) |
| `illustrator/` | Adobe Illustrator scripts (ExtendScript/JSX) |
| `macos/` | macOS automation scripts (AppleScript) |
| `general/` | Cross-platform utilities — renaming, data conversion, image metadata |

## Scripts

### InDesign

| Script | Description |
|--------|-------------|
| [`indesign/rename-by-week.py`](indesign/rename-by-week.py) | Renames InDesign exports sequentially by ISO week number for social media scheduling |
| [`indesign/apply-markdown.jsx`](indesign/apply-markdown.jsx) | Converts pasted Markdown text (e.g. from LLM output) into InDesign paragraph and character styles, including native table conversion with applied paragraph and table styles |
| [`indesign/xml-tags-to-styles.jsx`](indesign/xml-tags-to-styles.jsx) | Creates matching paragraph styles from all XML tags in the document — useful for bootstrapping an XML import workflow |
| [`indesign/setup-layers.jsx`](indesign/setup-layers.jsx) | Sets up a standardized layer structure (Images, Vectors, Text) with assigned colors, renaming default layers if present |
| [`indesign/batch-export-pdf.jsx`](indesign/batch-export-pdf.jsx) | Batch-exports all `.indd` files in a selected folder to PDF using the High Quality Print preset — saves into a `PDF/` subfolder |
| [`indesign/export-web-print.jsx`](indesign/export-web-print.jsx) | Exports two PDFs at once — web-optimized (`-web.pdf`) for client delivery and high-res (`-print.pdf`) for print and mockups — saves to a `30 Export/` subfolder |
| [`indesign/restructure-xml.py`](indesign/restructure-xml.py) | Restructures an XML file for InDesign import by extracting category values from rows into standalone elements |

### Illustrator

| Script | Description |
|--------|-------------|
| [`illustrator/setup-layers.jsx`](illustrator/setup-layers.jsx) | Sets up Primary, Black, and White layers for brand/logo documents, removes the default layer, and sets Primary as active |
| [`illustrator/colorize-layers.jsx`](illustrator/colorize-layers.jsx) | Duplicates artwork from Primary to Black and White layers, applying the respective CMYK fill color to each copy |
| [`illustrator/export-layers.jsx`](illustrator/export-layers.jsx) | Saves each layer as a separate .ai file named after the document and layer |
| [`illustrator/export-layers-svg.jsx`](illustrator/export-layers-svg.jsx) | Exports each layer as a separate SVG file into an SVG subfolder next to the source file |
| [`illustrator/export-print.jsx`](illustrator/export-print.jsx) | Exports EPS, SVG, and PDF into separate subfolders next to the source file |
| [`illustrator/export-web.jsx`](illustrator/export-web.jsx) | Exports SVG and high-res PNG (300 DPI, transparent) into separate subfolders next to the source file |

### macOS

| Script | Description |
|--------|-------------|
| [`macos/create-project-folder.applescript`](macos/create-project-folder.applescript) | Creates an Adobe production project folder with `10 Assets/`, `20 Entwurf/`, `30 Export/` subfolders — prompts for ID number and project name, applies Title-Case and umlaut transliteration |
| [`macos/rename-images.scpt`](macos/rename-images.scpt) | Batch-renames image files in a folder using a `{project-id}_{location}_{sequence}.ext` convention — prompts for project ID, location, and start number, then sorts by modification date (oldest first) |

### General

| Script | Description |
|--------|-------------|
| [`general/create-folders.py`](general/create-folders.py) | Creates a folder hierarchy from a Markdown list — each `- item` becomes a folder, indentation (2 spaces) defines nesting |
| [`general/rename-by-csv.py`](general/rename-by-csv.py) | Renames files in a folder based on a CSV mapping with `original_file` and `filename` columns — skips missing files and name conflicts |
| [`general/csv-to-xml.py`](general/csv-to-xml.py) | Converts a CSV file to XML — each row becomes a `<Row>` element with child elements per column, UTF-8 encoded |
| [`general/excel-titlecase.py`](general/excel-titlecase.py) | Converts a specified column in an Excel file to title case and saves the result as a new file |
| [`general/image-exif-description.py`](general/image-exif-description.py) | Reads a CSV with `filename` and `description` columns and writes the description into the EXIF metadata of each image |
