from django.db import models
from CustomUser.models import CustomUser
from encrypted_model_fields.fields import EncryptedTextField, EncryptedCharField
# Create your models here.

    
class Patient(models.Model):
    user = models.OneToOneField(CustomUser,on_delete=models.CASCADE)
    medical_history = EncryptedTextField(blank=True)
    medications = EncryptedTextField(blank=True)
    diagnoses = EncryptedTextField(blank=True)
    blood_group = EncryptedCharField(max_length=10)
    height =  models.DecimalField(max_digits=5,decimal_places=2)
    weight = models.DecimalField(max_digits=5,decimal_places=2)
    
    