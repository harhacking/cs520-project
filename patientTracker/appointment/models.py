from django.db import models
from doctor.models import Doctor
from patient.models import Patient

class Appointment(models.Model):
    appointment_time = models.BigIntegerField()
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    patient_notes = models.TextField(blank=True)
    doctor_notes = models.TextField(blank=True)
    is_accepted = models.BooleanField(default=False)