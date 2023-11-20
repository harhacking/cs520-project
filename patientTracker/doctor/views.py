import json
from django.shortcuts import render
from django.http import JsonResponse
from appointment.models import Appointment
from CustomUser.models import CustomUser
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import Doctor
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


@login_required
def doctor_appointments(request):
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
