import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribebharat.settings')
django.setup()

from api.models import Product

def fetch_products():
    print("Fetching products from 'products' table...")
    products = Product.objects.all()
    
    if not products.exists():
        print("No products found.")
        return

    print(f"\nFound {products.count()} products:\n")
    print(f"{'ID':<5} | {'Name':<30} | {'Collection':<15} | {'Price':<10}")
    print("-" * 70)
    
    for p in products:
        print(f"{p.id:<5} | {p.name[:28]:<30} | {p.collection:<15} | {p.price:<10}")

if __name__ == '__main__':
    fetch_products()
