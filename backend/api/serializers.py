from rest_framework import serializers
from .models import User, Product, CartItem, Order, OrderItem
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'dob')
        read_only_fields = ('id',)


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    otp = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('phone', 'email', 'first_name', 'password', 'password2', 'dob', 'otp')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        validated_data.pop('otp')  # Remove OTP as it's not a User model field
        user = User.objects.create_user(
            phone=validated_data['phone'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            dob=validated_data['dob'],
            password=validated_data['password']
        )
        return user


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for products"""
    slug = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'slug', 'price', 'description',
            'images', 'sizes', 'colors', 'collection',
            'design_theme', 'fabric', 'gsm', 'printing_type',
            'status', 'stock_quantity', 'is_active', 'created_at'
        )
        read_only_fields = ('id',)

    def get_slug(self, obj):
        return f"{obj.id}-{obj.name.lower().replace(' ', '-')}"


class CartItemProductSerializer(serializers.ModelSerializer):
    """Nested product serializer for cart items"""
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'images', 'collection')


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items"""
    product = CartItemProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True, required=False)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_id', 'quantity', 'size', 'color', 'total_price')
        read_only_fields = ('id', 'total_price')

    def get_total_price(self, obj):
        return float(obj.product.price * obj.quantity)


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    product = CartItemProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'quantity', 'price', 'size', 'color')


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders"""
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'total_amount', 'status', 'shipping_address',
            'payment_method', 'payment_status', 'created_at', 'items'
        )
        read_only_fields = ('id', 'user', 'created_at', 'items')
