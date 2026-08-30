from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'phone_number', 'email')
    list_editable = ('phone_number', 'email')
    list_display_links = ('id', 'full_name')
    search_fields = ('full_name', 'email', 'phone_number')
    ordering = ('full_name',)
    list_per_page = 20

    # 'id' must be marked as read-only since it's not in fieldsets by default
    readonly_fields = ('id',)

    fieldsets = (
        ('System Metadata', {
            'fields': ('id',)
        }),
        ('Personal Information', {
            'fields': ('full_name', 'email')
        }),
        ('Contact Details', {
            'fields': ('phone_number',),
            'description': 'Phone number must be exactly 10 digits.'
        }),
    )