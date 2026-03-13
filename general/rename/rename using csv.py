import csv
from pathlib import Path

# CONFIG
CSV_PATH = "/Users/daniel/Desktop/files2.csv"  # path to your CSV
TARGET_FOLDER = "webp2"  # folder containing the files

target_dir = Path(TARGET_FOLDER)

with open(CSV_PATH, newline="", encoding="utf-8") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        old_name = row["original_file"].strip()
        new_name = row["filename"].strip()

        old_path = target_dir / old_name
        new_path = target_dir / new_name

        if not old_path.exists():
            print(f"SKIP: {old_name} not found")
            continue

        if new_path.exists():
            print(f"SKIP: {new_name} already exists")
            continue

        old_path.rename(new_path)
        print(f"RENAMED: {old_name} -> {new_name}")
