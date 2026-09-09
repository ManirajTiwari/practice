import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, get_user_model

User = get_user_model()

# 1. Health Check Endpoint
def home(request):
    data = {'message': 'Django backend connected successfully!'}
    return JsonResponse(data)


# 2. User Registration View
@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            phone = data.get('phone')
            password = data.get('password')

            if not name or not email or not password:
                return JsonResponse({'detail': 'Name, email, and password are required.'}, status=400)

            # Check for existing email or phone
            if User.objects.filter(email=email).exists():
                return JsonResponse({'detail': 'An account with this email already exists.'}, status=400)
            
            if phone and User.objects.filter(phone_number=phone).exists():
                return JsonResponse({'detail': 'An account with this phone number already exists.'}, status=400)

            # Create User
            user = User.objects.create_user(
                email=email,
                name=name,
                phone_number=phone,
                password=password,
                auth_provider='email'
            )

            return JsonResponse({'message': 'User registered successfully!'}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            return JsonResponse({'detail': str(e)}, status=500)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)


# 3. User Login View (Email or Phone)
@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            identifier = data.get('identifier')  # Email or Phone
            password = data.get('password')

            if not identifier or not password:
                return JsonResponse({'detail': 'Identifier and password are required.'}, status=400)

            # Authenticate via Email or Phone
            user = authenticate(request, username=identifier, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({
                    'message': 'Login successful!',
                    'user': {
                        'id': user.id,
                        'name': user.name,
                        'email': user.email,
                        'phone': user.phone_number
                    }
                }, status=200)
            else:
                return JsonResponse({'detail': 'Invalid credentials.'}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON format.'}, status=400)

    return JsonResponse({'detail': 'Method not allowed.'}, status=405)