# rename-by-week

When exporting multiple pages from InDesign for social media, files come out with generic names like `document-001.jpg`. This script renames them by ISO calendar week (German `KW` format) — one (or more) files per week — so they're ready to hand off to a scheduler or posting workflow.

## Output format

With one file per week (`files_per_week = 1`), no sequence suffix is added:

```
2026-KW03.jpg
2026-KW04.jpg
2026-KW05.jpg
```

With multiple files per week, a sequence number is appended:

```
2026-KW03-01.jpg
2026-KW03-02.jpg
2026-KW04-01.jpg
```

Or without year:

```
KW03.jpg
KW04.jpg
```

## Usage

Edit the variables at the bottom of the script:

```python
folder = "/path/to/your/folder"
starting_week = 3      # starting ISO week number
starting_year = 2026   # starting year
files_per_week = 1     # how many files belong to each week
```

Then run:

```bash
python3 rename-by-week.py
```

## Parameters

| Parameter | Description |
|-----------|-------------|
| `folder` | Path to the folder containing files to rename |
| `starting_week` | ISO week number to start from |
| `starting_year` | Year to start from |
| `files_per_week` | Number of files assigned per week slot — a `-NN` sequence suffix is only added when this is greater than `1` |
| `include_year_in_name` | Prepend year to filename (default: `True`) |

## Notes

- Files are sorted by modification date (oldest first)
- Handles ISO year rollover automatically (e.g. week 53 → week 1 of next year)
- Renames files in place — no undo, so test on a copy first
