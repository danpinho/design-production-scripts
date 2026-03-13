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
for row in root.find('.//Story'):
    category_name = row.find('Kategorie').text
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
