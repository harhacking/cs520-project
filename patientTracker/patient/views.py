from django.shortcuts import render
from .models import Patient

# Create your views here.

def doctor_dashboard(request):
    patients = Patient.objects.all()
    return render(request,'doctor_dashboard.html',{'patients':patients})