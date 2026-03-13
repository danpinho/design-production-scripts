from PIL import Image
import piexif
import csv

# Load the CSV file containing filenames and descriptions
with open('/Users/danpinho/Desktop/images/descriptions.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    
    for row in reader:
        filename = row['filename']
        description = row['description']
        
        # Open the image file
        image = Image.open(f'/Users/danpinho/Desktop/images/{filename}')
        
        # Add description to the EXIF metadata
        exif_dict = piexif.load(image.info["exif"])
        exif_dict["0th"][piexif.ImageIFD.ImageDescription] = description
        exif_bytes = piexif.dump(exif_dict)
        
        # Save the image with the new description
        image.save(f'/Users/danpinho/Desktop/images2/{filename}', exif=exif_bytes)