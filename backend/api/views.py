from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import User, Product, CartItem, Order, OrderItem
from .serializers import (
    UserRegisterSerializer, UserSerializer,
    ProductSerializer, CartItemSerializer, OrderSerializer
)


from django.core.mail import send_mail
from django.conf import settings
import random
from django.core.cache import cache

def generate_otp():
    return str(random.randint(100000, 999999))

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp(request):
    """POST /api/auth/send-otp/"""
    email = request.data.get('email')
    if not email:
        return Response({'detail': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    otp = generate_otp()
    cache.set(f'otp_{email}', otp, timeout=300) # 5 minutes
    
    # Send Email
    try:
        print(otp)
        send_mail(
            'Your OTP for TribeBharat',
            f'Your OTP is {otp}. It is valid for 5 minutes.',
            settings.EMAIL_HOST_USER if hasattr(settings, 'EMAIL_HOST_USER') else 'noreply@tribebharat.com',
            [email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending email: {e}")
        # For dev, we might want to return OTP if email fails, but let's stick to console backend
    
    return Response({'detail': 'OTP sent successfully.'})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """POST /api/auth/register/"""
    otp = request.data.get('otp')
    email = request.data.get('email')
    
    if not otp or not email:
        return Response({'detail': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
    cached_otp = cache.get(f'otp_{email}')
    if not cached_otp or cached_otp != otp:
        return Response({'detail': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)
    
    print("Request data:", request.data)
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Send Welcome Email
        try:
            send_mail(
                'Welcome to TribeBharat!',
                f'Hi {user.first_name},\n\nThank you for joining TribeBharat. We are excited to have you!',
                'noreply@tribebharat.com',
                [user.email],
                fail_silently=True,
            )
        except:
            pass

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)
    else:
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """POST /api/auth/login/ - return {access, refresh, user}"""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'detail': 'Email and password required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        return Response(
            {'detail': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Send Login Notification
    try:
        send_mail(
            'New Login to TribeBharat',
            f'Hi {user.first_name},\n\nWe noticed a new login to your account.',
            'noreply@tribebharat.com',
            [user.email],
            fail_silently=True,
        )
    except:
        pass

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': UserSerializer(user).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """GET /api/auth/profile/ - IsAuthenticated"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """ProductViewSet - list & retrieve"""
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        collection = self.request.query_params.get('collection')
        if collection:
            queryset = queryset.filter(collection__iexact=collection)
        
        # Price filtering
        min_price = self.request.query_params.get('minPrice')
        max_price = self.request.query_params.get('maxPrice')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        return queryset.order_by('-created_at')


class CartViewSet(viewsets.ModelViewSet):
    """CartViewSet - list/create/patch/destroy and clear action"""
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related('product')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """POST /api/cart/ - Body: {productId, quantity, size, color}"""
        product_id = request.data.get('productId') or request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        size = request.data.get('size') or None
        color = request.data.get('color') or None

        if not product_id:
            return Response(
                {'detail': 'productId required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(pk=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Product not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItem.objects.get_or_create(
            user=request.user,
            product=product,
            size=size,
            color=color,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        serializer = self.get_serializer(cart_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        """PATCH /api/cart/:id/ - Body: {quantity}"""
        instance = self.get_object()
        quantity = request.data.get('quantity')

        if quantity is None:
            return Response(
                {'detail': 'quantity required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        quantity = int(quantity)
        if quantity <= 0:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        instance.quantity = quantity
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['delete'], url_path='clear')
    def clear(self, request):
        """DELETE /api/cart/clear/"""
        self.get_queryset().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_api(request):
    """Test endpoint"""
    return Response({'message': 'Backend is working!'})


class OrderViewSet(viewsets.ModelViewSet):
    """OrderViewSet - list & create (checkout)"""
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """POST /api/orders/ - Create order from cart"""
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response(
                {'detail': 'Cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total
        total_amount = sum(item.product.price * item.quantity for item in cart_items)

        # Create Order
        order = Order.objects.create(
            user=user,
            total_amount=total_amount,
            status='confirmed',  # Auto-confirm for now
            payment_status='completed', # Mock payment
            payment_method='COD', # Default
            shipping_address=request.data.get('shipping_address', 'Default Address')
        )

        # Create Order Items
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price,
                size=item.size,
                color=item.color
            )

        # Clear Cart
        cart_items.delete()

        # Send Order Confirmation Email
        try:
            send_mail(
                f'Order Confirmation #{order.id}',
                f'Hi {user.first_name},\n\nYour order #{order.id} has been confirmed.\nTotal: {order.total_amount}\n\nThank you for shopping with us!',
                'noreply@tribebharat.com',
                [user.email],
                fail_silently=True,
            )
        except:
            pass

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
