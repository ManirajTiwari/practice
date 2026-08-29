from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    # Columns shown in the admin list view
    list_display = ('id', 'full_name', 'phone_number', 'email')
    
    # Makes fields directly editable from the list view table without clicking into the record
    list_editable = ('phone_number', 'email')
    
    # Links that click through to the full edit form page
    list_display_links = ('id', 'full_name')
    
    # Adds a search bar for specific fields
    search_fields = ('full_name', 'email', 'phone_number')
    
    # Enables ordering by clicking column headers
    ordering = ('full_name',)
    
    # Sets the pagination limit per page in the admin table
    list_per_page = 20

    # Customizes field structure on the detail edit form
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email')
        }),
        ('Contact Details', {
            'fields': ('phone_number',),
            'description': 'Phone number must be exactly 10 digits.'
        }),
    )