from django import forms
from .models import Person

class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['full_name', 'phone_number', 'email']
        
        # Optional: Add placeholders and HTML attributes/styling
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'John Doe',
                'class': 'form-control',
            }),
            'phone_number': forms.TextInput(attrs={
                'placeholder': '1234567890',
                'class': 'form-control',
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'john@example.com',
                'class': 'form-control',
            }),
        }
        
        # Optional: Custom field labels
        labels = {
            'full_name': 'Full Name',
            'phone_number': 'Phone Number (10 digits)',
            'email': 'Email Address',
        }