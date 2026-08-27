from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    # Displays columns in the table list view
    list_display = ('full_name', 'phone_number', 'email')
    
    # Adds a search bar for specific fields
    search_fields = ('full_name', 'email', 'phone_number')
    
    # Enables fast ordering by clicking column headers
    ordering = ('full_name',)