import json
from django.shortcuts import render
from django.http import JsonResponse
from appointment.models import Appointment
from CustomUser.models import CustomUser
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import Doctor
from django.views.decorators.csrf import csrf_exempt



def doctor_appointments(request,doctor_id):
    try:
        doctor = Doctor.objects.get(pk=doctor_id)
        appointments = Appointment.objects.filter(doctor=doctor)
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
def register_doctor(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    try:
        data = request.POST
        is_doctor = True
        
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        specialization = data.get('specialization')
        
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
