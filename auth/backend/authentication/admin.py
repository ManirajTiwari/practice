from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['email', 'name', 'phone_number', 'auth_provider', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('name', 'phone_number', 'auth_provider')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('name', 'phone_number', 'auth_provider')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)