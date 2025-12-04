from django.core.management.base import BaseCommand
from api.models import Category, Product


class Command(BaseCommand):
    help = 'Load sample categories and products into the database'

    def handle(self, *args, **kwargs):
        self.stdout.write('Loading sample data...')

        # Create categories
        categories_data = [
            {'name': 'Men', 'description': "Men's clothing and accessories"},
            {'name': 'Women', 'description': "Women's clothing and accessories"},
            {'name': 'Kids', 'description': "Children's clothing"},
            {'name': 'Accessories', 'description': 'Fashion accessories for all'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories[category.name] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))

        # Create products for Men
        men_products = [
            {
                'name': 'Classic Cotton T-Shirt',
                'description': 'A classic cotton t-shirt perfect for everyday wear',
                'price': 799.00,
                'category': categories['Men'],
                'color': 'blue',
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 50,
            },
            {
                'name': 'Denim Jacket',
                'description': 'A stylish denim jacket that never goes out of style',
                'price': 2499.00,
                'category': categories['Men'],
                'color': 'blue',
                'sizes': ['S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 30,
            },
            {
                'name': 'Formal Shirt',
                'description': 'Professional formal shirt for office wear',
                'price': 1299.00,
                'category': categories['Men'],
                'color': 'white',
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 25,
            },
            {
                'name': 'Casual Polo',
                'description': 'Comfortable polo shirt for casual occasions',
                'price': 999.00,
                'category': categories['Men'],
                'color': 'red',
                'sizes': ['S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 40,
            },
            {
                'name': 'Leather Jacket',
                'description': 'Premium leather jacket for a bold look',
                'price': 4999.00,
                'category': categories['Men'],
                'color': 'black',
                'sizes': ['S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 15,
            },
            {
                'name': 'Chinos Pants',
                'description': 'Comfortable chinos perfect for any occasion',
                'price': 1799.00,
                'category': categories['Men'],
                'color': 'beige',
                'sizes': ['28', '30', '32', '34', '36'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 35,
            },
            {
                'name': 'Hoodie',
                'description': 'Cozy hoodie for cold weather',
                'price': 1599.00,
                'category': categories['Men'],
                'color': 'gray',
                'sizes': ['S', 'M', 'L', 'XL', 'XXL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 45,
            },
            {
                'name': 'Blazer',
                'description': 'Elegant blazer for formal occasions',
                'price': 3499.00,
                'category': categories['Men'],
                'color': 'navy',
                'sizes': ['S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 20,
            },
        ]

        # Create products for Women
        women_products = [
            {
                'name': 'Floral Maxi Dress',
                'description': 'Beautiful floral maxi dress perfect for summer',
                'price': 1899.00,
                'category': categories['Women'],
                'color': 'pink',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 30,
            },
            {
                'name': 'Denim Skirt',
                'description': 'Versatile denim skirt for casual wear',
                'price': 1299.00,
                'category': categories['Women'],
                'color': 'blue',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 25,
            },
            {
                'name': 'Silk Blouse',
                'description': 'Elegant silk blouse for professional wear',
                'price': 2199.00,
                'category': categories['Women'],
                'color': 'white',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 20,
            },
            {
                'name': 'Casual Top',
                'description': 'Comfortable casual top for everyday wear',
                'price': 899.00,
                'category': categories['Women'],
                'color': 'red',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 40,
            },
            {
                'name': 'Evening Gown',
                'description': 'Stunning evening gown for special occasions',
                'price': 4999.00,
                'category': categories['Women'],
                'color': 'black',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 10,
            },
            {
                'name': 'Palazzo Pants',
                'description': 'Comfortable palazzo pants for relaxed wear',
                'price': 1599.00,
                'category': categories['Women'],
                'color': 'beige',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 35,
            },
            {
                'name': 'Cardigan',
                'description': 'Cozy cardigan for layering',
                'price': 1799.00,
                'category': categories['Women'],
                'color': 'gray',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 30,
            },
            {
                'name': 'Office Blazer',
                'description': 'Professional blazer for office wear',
                'price': 2999.00,
                'category': categories['Women'],
                'color': 'navy',
                'sizes': ['XS', 'S', 'M', 'L', 'XL'],
                'images': ['/images/placeholder-product.svg'],
                'stock_quantity': 15,
            },
        ]

        all_products = men_products + women_products

        for prod_data in all_products:
            product, created = Product.objects.get_or_create(
                name=prod_data['name'],
                defaults=prod_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))

        self.stdout.write(self.style.SUCCESS('Sample data loaded successfully!'))
