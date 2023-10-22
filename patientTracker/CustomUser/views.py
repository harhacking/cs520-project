from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.http import HttpResponseForbidden, JsonResponse
from doctor.models import Doctor
from patient.models import Patient



@csrf_exempt
def auth_user(request):
    data = request.POST
    username = data['username']
    password = data['password']
    user = authenticate(username=username,password=password)
    
    if user:
        id = None
        return_obj = None
        if(user.is_doctor):
            doctor = Doctor.objects.get(user=user)
            id = doctor.id
            return_obj = {
            'is_doctor': user.is_doctor,
            'doctor_id': id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'specialization': doctor.specialization
        }
        else:
            patient = Patient.objects.get(user=user)
            id = patient.id
            return_obj = {
            'is_doctor': user.is_doctor,
            'patient_id': id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }
        return JsonResponse(return_obj,status=200)
    else:       
        return HttpResponseForbidden()
    
