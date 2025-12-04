import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribebharat.settings')
django.setup()

from api.models import Product

count = Product.objects.count()
print(f"Total Products: {count}")

if count > 0:
    print("Sample Products:")
    for p in Product.objects.all()[:5]:
        print(f"- {p.name} ({p.category}, {p.price})")
else:
    print("No products found in the database.")
