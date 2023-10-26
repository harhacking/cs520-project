from django.db import models
from CustomUser.models import CustomUser

class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    specialization = models.CharField(max_length=100)
    
    