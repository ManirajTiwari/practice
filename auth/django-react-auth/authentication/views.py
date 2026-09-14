from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.github.views import GitHubOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5173"
    client_class = OAuth2Client

class GitHubLogin(SocialLoginView):
    adapter_class = GitHubOAuth2Adapter
    callback_url = "http://localhost:5173/github/callback"
    client_class = OAuth2Client
    
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username') 
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'please provide all fields'}, status= status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'username already exists'}, status= status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'user registered successfully'}, status= status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_route(request):
    return Response({'message': f'Hello {request.user.username}, This is protected API endpoint!'})
