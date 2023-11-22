import json
from django.shortcuts import render
from django.http import JsonResponse
from appointment.models import Appointment
from CustomUser.models import CustomUser
from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseForbidden
from .models import Doctor
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict



def doctor_appointments(request):
    if not request.user.is_authenticated:
            return HttpResponseForbidden("User is not authenticated")
    start_time = request.GET.get('start_time',None)
    end_time = request.GET.get('end_time',None)
    try:
        doctor = Doctor.objects.get(user=request.user)
        appointments = Appointment.objects.filter(doctor=doctor)
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
    except Doctor.DoesNotExist:
        return JsonResponse({'error': 'Doctor not found'}, status=404)
    
@csrf_exempt
def doctor_details(request):
    if not request.user.is_authenticated:
        return HttpResponseForbidden("User is not authenticated")
    if request.method == 'GET':
        try:
            doctor = Doctor.objects.get(user=request.user)
            user_obj = model_to_dict(request.user)
            doctor_obj = model_to_dict(doctor)
            return JsonResponse({"CustomUser": user_obj,"Doctor": doctor_obj})
        
        except Doctor.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'}, status=404)
    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            doctor = Doctor.objects.get(user=request.user)
           
            doctor.specialization = data.get('specialization', doctor.specialization)
            doctor.save()
            
            user = request.user
            if 'username' in data:
                new_username = data['username']
                if CustomUser.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                    return JsonResponse({'error': 'Username is already in use'}, status=400)
            if 'email' in data:
                new_email = data['email']
                if CustomUser.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                    return JsonResponse({'error': 'Email address is already in use'}, status=400)
                user.email = data['email']
            if 'first_name' in data:
                user.first_name = data['first_name']
            if 'last_name' in data:
                user.last_name = data['last_name']
            if 'password' in data:
                user.set_password(data['password'])  
            user.save()
            return JsonResponse({'message': 'Doctor details updated successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Doctor.DoesNotExist:
            return JsonResponse({'error': 'Doctor not found'}, status=404)
    else:
        return HttpResponseNotAllowed(["GET","PUT"])

@csrf_exempt
def register_doctor(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    try:
        data = json.loads(request.body)
        is_doctor = True
        
        first_name = data['first_name']
        last_name = data['last_name']
        username = data['username']
        password = data['password']
        email = data['email']
        specialization = data['specialization']
        
        user = CustomUser.objects.create_user(username=username,email=email,password=password,is_doctor=is_doctor,first_name=first_name,last_name=last_name)
        
        doctor = Doctor.objects.create(user=user,specialization=specialization)
        doctor.save
        response_data = {
            'success': True,
            'message': 'Doctor object created successfully',
            'id': doctor.id
        }
        return JsonResponse(response_data,status=201)
    except Exception as e:
        response_data = {
            'success': False,
            'message': str(e),
            'id': -1
        }
        return JsonResponse(response_data,status=400)
