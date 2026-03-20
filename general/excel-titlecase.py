import pandas as pd

# Load the Excel file
file_path = '/Users/daniel/Desktop/leads.xlsx'  # Update this to the path of your Excel file
sheet_name = 'Rechtsanwalt'  # Update this if your data is in a different sheet
df = pd.read_excel(file_path, sheet_name=sheet_name)

# Column to fix (change 'YourColumnName' to the name of your column)
column_name = 'title'  # Update this to your column name
df[column_name] = df[column_name].str.title()  # Converts text to title case

# Save the modified DataFrame back to a new Excel file
output_file_path = '/Users/daniel/Desktop/newleads.xlsx'  # You can change the name of the output file
df.to_excel(output_file_path, index=False)

print('File has been saved as:', output_file_path)