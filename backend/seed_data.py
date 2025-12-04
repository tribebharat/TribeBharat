import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tribebharat.settings')
django.setup()

from api.models import Product, Category

def seed_products():
    # Clear existing data
    Product.objects.all().delete()
    Category.objects.all().delete()
    print("Cleared existing products and categories.")

    # Create Categories
    cat_tshirts = Category.objects.create(name="T-Shirts", description="Premium cotton t-shirts")
    cat_hoodies = Category.objects.create(name="Hoodies", description="Cozy and stylish hoodies")
    print("Created categories.")

    products_data = [
        {
            "name": "Bharat Before Newton T-Shirt",
            "description": "Ancient Indian laws of motion - Before Newton There Was... Crafted from Premium Cotton Lycra (240 GSM) with high-quality Screen Printing.",
            "price": 1299,
            "category": cat_tshirts,
            "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "color": "Black"
        },
        {
            "name": "Devnagri T-Shirt",
            "description": "Banaras city illustration with Devnagri Hindi typography. Crafted from Premium Cotton Lycra (240 GSM) with high-quality Screen Printing.",
            "price": 1299,
            "category": cat_tshirts,
            "image": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1887&auto=format&fit=crop",
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "color": "Black"
        },
        {
            "name": "Threads of Culture T-Shirt",
            "description": "Threads of Culture slogan with Indian cityscape illustration. Crafted from Premium Cotton Lycra (240 GSM) with high-quality Screen Printing.",
            "price": 1299,
            "category": cat_tshirts,
            "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "color": "Black"
        },
        # Adding a sample Hoodie to populate that category too
        {
            "name": "Urban Legend Hoodie",
            "description": "Stay warm in style with our premium fleece hoodie. Features a relaxed fit and durable construction.",
            "price": 2499,
            "category": cat_hoodies,
            "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop",
            "sizes": ["M", "L", "XL"],
            "color": "Navy"
        }
    ]

    for data in products_data:
        Product.objects.create(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            category=data['category'],
            images=[data['image']], 
            sizes=data['sizes'],
            color=data.get('color', '')
        )
        print(f"Created: {data['name']}")

    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_products()
