from django.shortcuts import render
from .models import Patient
from django.forms.models import model_to_dict
from django.http import JsonResponse, HttpResponseNotAllowed
import json

def patient_details(request):
    if request.method == 'GET':
        try:
            patient = Patient.objects.get(user=request.user)
            user_obj = model_to_dict(request.user)
            patient_obj = model_to_dict(patient)
            return JsonResponse({"CustomUser": user_obj,"Patient": patient_obj})
        
        except Patient.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'}, status=404)
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            patient = Patient.objects.get(user=request.user)
           
            patient.diagnoses = data.get('diagnoses', patient.diagnoses)
            patient.blood_group = data.get('blood_group',patient.blood_group)
            patient.height = data.get('height',patient.height)
            patient.weight = data.get('weight',patient.weight)
            patient.medications = data.get('medications', patient.medications)
            patient.medical_history = data.get('medical_history', patient.medical_history)
            patient.save()
            
            user = request.user
            if 'email' in data:
                user.email = data['email']
            if 'first_name' in data:
                user.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
            if 'password' in data:
                user.set_password(data['password'])  
            user.save()
            return JsonResponse({'message': 'Patient details updated successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Patient.DoesNotExist:
            return JsonResponse({'error': 'Patient not found'}, status=404)
    else:
        return HttpResponseNotAllowed(["GET","PUT"])
        
    