from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username') 
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'please provide all fields'}, status= status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(uername=username).exists():
        return Response({'error': 'username already exists'}, status= status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'user registered successfully'}, status= status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_route(request):
    return Response({'message': f'Hello {request.user.username}, This is protected API endpoint!'})
