import csv
import xml.etree.ElementTree as ET

def csv_to_xml(csv_file, xml_file):
    # Create the root element
    root = ET.Element('Root')
    
    # Open the CSV file with the correct encoding and newline handling
    with open(csv_file, newline='', mode='r', encoding='utf-8-sig') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Iterate through each row of the CSV file
        for row in reader:
            row_elem = ET.SubElement(root, 'Row')
            for tag, text in row.items():
                # Create a subelement for each column, removing any leading/trailing whitespace
                child = ET.SubElement(row_elem, tag.strip())
                child.text = text.strip() if text else None

    # Create the XML tree and write it to a file
    tree = ET.ElementTree(root)
    tree.write(xml_file, xml_declaration=True, encoding='utf-8', method="xml")

# Specify CSV file and output XML file
csv_file = 'Speisekarte-Grid view.csv'
xml_file = 'Speisekarte-Grid view.xml'

# Convert CSV to XML
csv_to_xml(csv_file, xml_file)
