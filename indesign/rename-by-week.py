import os
from datetime import date


def iso_weeks_in_year(year: int) -> int:
    # Dec 28 is always in the last ISO week of the ISO year
    return date(year, 12, 28).isocalendar().week


def batch_rename_by_week(
    folder_path, starting_week, starting_year, files_per_week=1, include_year_in_name=True
):
    # Get files sorted by modified time (ascending)
    files = sorted(
        [
            f
            for f in os.listdir(folder_path)
            if os.path.isfile(os.path.join(folder_path, f))
        ],
        key=lambda f: os.path.getmtime(os.path.join(folder_path, f)),
    )

    print("Files found:", files)

    if not files:
        print("No files found in the folder.")
        return

    file_index = 0
    current_week = starting_week
    current_year = starting_year
    weeks_this_year = iso_weeks_in_year(current_year)

    for filename in files:
        file_path = os.path.join(folder_path, filename)

        # if we're at the first file of a week block, maybe advance the week
        if file_index > 0 and (file_index % files_per_week) == 0:
            current_week += 1

            # rollover to next ISO year if needed
            if current_week > weeks_this_year:
                current_week = 1
                current_year += 1
                weeks_this_year = iso_weeks_in_year(current_year)

        file_number = (file_index % files_per_week) + 1
        ext = os.path.splitext(filename)[1]

        if include_year_in_name:
            new_name = f"{current_year}-W{current_week:02d}-{file_number:02d}{ext}"
        else:
            new_name = f"W{current_week:02d}-{file_number:02d}{ext}"

        new_path = os.path.join(folder_path, new_name)

        os.rename(file_path, new_path)
        print(f"Renamed: {filename} → {new_name}")

        file_index += 1


# Usage
folder = "/path/to/your/folder"  # Replace with your actual folder path
starting_week = 3
starting_year = 2026
files_per_week = 1

batch_rename_by_week(folder, starting_week, starting_year, files_per_week)
