from django.db import models
from django.core.validators import RegexValidator

class Person(models.Model):
    full_name = models.CharField(max_length=100)
    phone_validator = RegexValidator(regex=r'^\d{10}$')
    phone_number = models.IntegerField(max_length=20, validators = [phone_validator])
    email = models.EmailField()

    def __str__(self):
        return self.full_name