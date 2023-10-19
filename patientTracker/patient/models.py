from django.db import models
from django.contrib.auth.models import User
from doctor.models import Doctor
# Create your models here.

class Patient(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    medical_history = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    diagnoses = models.TextField(blank=True)
    blood_group = models.CharField(max_length=10)
    height =  models.DecimalField(max_digits=5,decimal_places=2)
    weight = models.DecimalField(max_digits=5,decimal_places=2)
    
    