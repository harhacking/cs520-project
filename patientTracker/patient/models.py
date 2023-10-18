from django.db import models
from django.contrib.auth.models import User
from doctor.models import Doctor
# Create your models here.

class Patient(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor,on_delete=models.CASCADE, related_name="patients")
    name = models.CharField(max_length=100)
    medical_history = models.TextField()
    medications = models.TextField()
    diagnoses = models.TextField()
