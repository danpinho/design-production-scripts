"""
restructure-xml.py

Restructures an XML file for InDesign import by extracting unique Kategorie
values from rows and promoting them to standalone elements in the Story.
Rows are rebuilt without the Kategorie field.

Input:  input.xml  (flat row structure with Kategorie per row)
Output: output.xml (Kategorie elements listed separately, rows without them)

Usage:
    python3 restructure-xml.py
"""
import xml.etree.ElementTree as ET

# Load the XML file
tree = ET.parse('input.xml')
root = tree.getroot()

# Prepare a new XML structure
new_root = ET.Element("Root")
story = ET.SubElement(new_root, "Story")

# Dictionary to hold categories and their rows
categories = {}

# Process each row in the original XML
source_story = root.find('.//Story')
if source_story is None:
    raise ValueError("No <Story> element found in input.xml")

for row in source_story:
    kategorie_el = row.find('Kategorie')
    category_name = kategorie_el.text if kategorie_el is not None else None
    if category_name not in categories:
        # Create a new category element if it doesn't exist
        category_element = ET.SubElement(story, 'Kategorie')
        category_element.text = category_name
        categories[category_name] = category_element

    # Make a deep copy of the row to manipulate it by removing the Kategorie element
    new_row = ET.Element("Row")
    for element in row:
        if element.tag != 'Kategorie':
            new_row.append(element)

    # Append the new row to the story, not under the category element
    story.append(new_row)

# Save the new structured XML to a file
new_tree = ET.ElementTree(new_root)
new_tree.write('output.xml', encoding='utf-8', xml_declaration=True)
