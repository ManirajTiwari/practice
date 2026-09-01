from django.db import models
from django.core.validators import RegexValidator

class Person(models.Model):
    full_name = models.CharField(max_length=100)
    
    phone_validator = RegexValidator(
        regex=r'^\d{10}$', 
        message="Phone number must be exactly 10 digits."
    )
    phone_number = models.CharField(
        max_length=10, 
        validators=[phone_validator]
    )
    
    email = models.EmailField()
    
    # Added ImageField with upload path and optional flag
    image = models.ImageField(upload_to='persons/', null=True, blank=True)

    def __str__(self):
        return self.full_name