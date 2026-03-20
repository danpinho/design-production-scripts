import os

# Define the input Markdown file and the base output directory
input_file = "folders.md"  # Change this to your actual filename
base_path = "./output"  # Change this if you want a different output location

os.makedirs(base_path, exist_ok=True)

def create_folders_from_md(file_path, base_dir):
    """Creates a folder hierarchy from a Markdown list.

    Each list item (prefixed with "- ") becomes a folder.
    Indentation (2 spaces per level) determines nesting.
    Folder names are taken verbatim from the list item text.

    Args:
        file_path: Path to the Markdown file containing the folder structure.
        base_dir:  Root directory under which the hierarchy is created.
    """
    with open(file_path, "r", encoding="utf-8") as file:
        folder_stack = [base_dir]

        for line in file:
            line = line.rstrip()

            # Skip empty lines
            if not line.strip():
                continue

            # Count indentation level (tabs or spaces)
            indent_level = (len(line) - len(line.lstrip())) // 2  # Adjust based on spacing

            # Extract folder name after "-"
            if line.lstrip().startswith("- "):
                folder_name = line.lstrip()[2:].strip()

                # Adjust stack depth based on indentation
                while len(folder_stack) > indent_level + 1:
                    folder_stack.pop()

                # Get the current parent directory
                current_dir = os.path.join(folder_stack[-1], folder_name)
                os.makedirs(current_dir, exist_ok=True)

                # Push new folder onto stack
                folder_stack.append(current_dir)

# Run the script
create_folders_from_md(input_file, base_path)

print("Folders created successfully!")