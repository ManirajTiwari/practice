from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email or phone number can be used as the unique identifier.
    """
    def create_user(self, email, name, phone_number=None, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        
        email = self.normalize_email(email)
        extra_fields.setdefault('username', email)  # Fill username automatically
        
        user = self.model(
            email=email,
            name=name,
            phone_number=phone_number,
            **extra_fields
        )
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  # For social sign-ups without passwords
            
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email=email, name=name, password=password, **extra_fields)


class CustomUser(AbstractUser):
    # Core User Details
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)

    # Auth Provider Tracker
    AUTH_PROVIDERS = (
        ('email', 'Email/Phone'),
        ('google', 'Google'),
        ('github', 'GitHub'),
    )
    auth_provider = models.CharField(
        max_length=20, 
        choices=AUTH_PROVIDERS, 
        default='email'
    )

    # Use Email as the primary login field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.name} ({self.email})"