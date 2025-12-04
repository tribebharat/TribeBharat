import pandas as pd
import os
from django.core.management.base import BaseCommand
from api.models import Product

class Command(BaseCommand):
    help = 'Import products from Excel file'

    def handle(self, *args, **kwargs):
        file_path = "data/products.xlsx"
        
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File not found: {file_path}'))
            return

        try:
            df = pd.read_excel(file_path)
            
            # Clear existing products to avoid duplicates during dev
            Product.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared existing products.'))

            for _, row in df.iterrows():
                # Normalize colors and sizes
                colors = [c.strip() for c in [row.get("Color 1"), row.get("Color 2"), row.get("Color 3"), row.get("Color 4")] if pd.notna(c)]
                
                sizes_str = row.get("Sizes", "")
                if sizes_str == "All Sizes":
                    sizes = ["XS", "S", "M", "L", "XL", "XXL"]
                else:
                    sizes = [s.strip() for s in str(sizes_str).split(",") if s.strip()]

                # Determine collection (default to tshirts based on data, but could be dynamic)
                # For now, assuming all in excel are tshirts as per user request example
                collection = "tshirts"
                if "hoodie" in row["Product Name"].lower():
                    collection = "hoodies"

                # Determine image based on collection
                image_url = '/media/products/Tshirts.jpeg' if collection == 'tshirts' else '/media/products/Hoodie.jpeg'

                Product.objects.create(
                    name=row["Product Name"],
                    description=row["Design Theme"], # Using Design Theme as description for now
                    price=1299, # Default price as it's not in the excel columns provided in prompt, but was in seed
                    design_theme=row["Design Theme"],
                    fabric=row["Fabric"],
                    gsm=row["GSM"],
                    printing_type=row["Printing Type"],
                    colors=colors,
                    sizes=sizes,
                    status=row["Status"],
                    collection=collection,
                    images=[image_url],
                    stock_quantity=100 # Default stock
                )
                self.stdout.write(self.style.SUCCESS(f'Created product: {row["Product Name"]}'))

            self.stdout.write(self.style.SUCCESS('Successfully imported products'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing products: {str(e)}'))
