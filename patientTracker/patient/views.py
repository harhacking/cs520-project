from django.shortcuts import render

from CustomUser.models import CustomUser
from .models import Patient
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseNotAllowed
from appointment.models import Appointment
import json




@login_required
def patient_appointments(request):
    start_time = request.GET.get('start_time',None)
    end_time = request.GET.get('end_time',None)
    try:
        patient = Patient.objects.get(user=request.user)
        appointments = Appointment.objects.filter(patient=patient)
        if start_time:
            appointments = appointments.filter(appointment_time__gte=start_time)
        if end_time:
            appointments = appointments.filter(appointment_time__lte=end_time)
        appointment_list = []
        for appointment in appointments:
            appointment_list.append(
                {
                'id': appointment.id,
                'appointment_time': appointment.appointment_time,
                'patient_id': appointment.patient.id,
                'patient_notes': appointment.patient_notes,
                'doctor_notes': appointment.doctor_notes,
                'patient name': appointment.patient.user.first_name + " " +appointment.patient.user.last_name
            })
        return JsonResponse({'appointments': appointment_list})
    except Patient.DoesNotExist:
        return JsonResponse({'error': 'Patient not found'}, status=404)


@csrf_exempt
def register_patient(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    try:
        data = json.loads(request.body)
        is_doctor = False
        
        first_name = data['first_name']
        last_name = data['last_name']
        username = data['username']
        password = data['password']
        email = data['email']
        diagnoses = data['diagnonses']
        blood_group = data['blood_group']
        height = data['height']
        weight = data['weight']
        medications = data['medications']
        medical_history = data['medical_history']
        
        user = CustomUser.objects.create_user(username=username,email=email,password=password,is_doctor=is_doctor,first_name=first_name,last_name=last_name)
        
        patient = Patient.objects.create(user=user,diagnoses=diagnoses,blood_group=blood_group,height=height,weight=weight,medications=medications,medical_history=medical_history)
        patient.save
        response_data = {
            'success': True,
            'message': 'Patient object created successfully',
            'id': patient.id
        }
        return JsonResponse(response_data,status=201)
    except Exception as e:
        response_data = {
            'success': False,
            'message': str(e),
            'id': -1
        }
        return JsonResponse(response_data,status=400)
    
@csrf_exempt
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
            if 'username' in data:
                new_username = data['username']
                if CustomUser.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                    return JsonResponse({'error': 'Username is already in use'}, status=400)
            if 'email' in data:
                new_email = data['email']
                if CustomUser.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                    return JsonResponse({'error': 'Email address is already in use'}, status=400)
                user.email = new_email
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
        
    