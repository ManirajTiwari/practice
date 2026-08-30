from django import forms
from django.core.exceptions import ValidationError
from .models import Person

class PersonForm(forms.ModelForm):
    class Meta:
        model = Person
        fields = ['full_name', 'phone_number', 'email']
        
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
        
        labels = {
            'full_name': 'Full Name',
            'phone_number': 'Phone Number (10 digits)',
            'email': 'Email Address',
        }

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        
        if not phone_number.isdigit() or len(phone_number) != 10:
            raise ValidationError('Phone number must be exactly 10 digits and contain only numbers.')
            
        return phone_number