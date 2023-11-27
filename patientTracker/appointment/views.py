
from django.shortcuts import render, get_object_or_404
from doctor.models import Doctor
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseBadRequest
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Appointment
from patient.models import Patient
from doctor.models import Doctor
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json


ms_hour = int(timedelta(hours=1).total_seconds() * 1000)


def epoch_milliseconds_to_datetime(epoch_milliseconds):
    return datetime.utcfromtimestamp(epoch_milliseconds / 1000)


def available_appointment_times(request, doctor_id):
    if not request.user.is_authenticated:
        return HttpResponseForbidden("User is not authenticated")
    if request.method == "GET":
        try:
            doctor = Doctor.objects.get(pk=doctor_id)
        except Doctor.DoesNotExist:
            return JsonResponse({"error": "Doctor not found"}, status=404)

        start_time_param = request.GET.get('start_time')
        end_time_param = request.GET.get('end_time')

        if not start_time_param or not end_time_param:
            return JsonResponse({"error": "start_time and end_time parameters are required"}, status=400)

        start_time = epoch_milliseconds_to_datetime(int(start_time_param))
        end_time = epoch_milliseconds_to_datetime(int(end_time_param))

        if start_time >= end_time:
            return JsonResponse({"error": "start_time must be before end_time"}, status=400)

        appointments = Appointment.objects.filter(doctor=doctor)

        available_times = []
        current_time =start_time
        
        while current_time <= end_time:
            working_hours_start = datetime.combine(current_time.date(), datetime.strptime("09:00", "%H:%M").time())
            working_hours_end = datetime.combine(current_time.date(), datetime.strptime("16:00", "%H:%M").time())
            
            if working_hours_start.time() <= current_time.time() <= working_hours_end.time() and current_time.weekday() < 5:
                curr_timestamp = int(current_time.timestamp())*1000
                
                if not appointments.filter(
                     Q(appointment_time__gt=curr_timestamp - ms_hour, appointment_time__lt=curr_timestamp + ms_hour)
                ).exists():
                    available_times.append(curr_timestamp)

            current_time += timedelta(hours=1)

        return JsonResponse({"available_times": available_times})

@csrf_exempt
def create_appointment(request):
    if not request.user.is_authenticated:
            return HttpResponseForbidden("User is not authenticated")
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
   
    try:
        data = json.loads(request.body)
        patient_id = data['patient_id']
        doctor_id = data['doctor_id']
        appointment_time = data['appointment_time']
        patient_notes = data['patient_notes']
        doctor_notes = data.get('doctor_notes',"")
    except:
        return HttpResponseBadRequest("Invalid request body", status=400)
    
    req_doctor = Doctor.objects.get(pk=doctor_id)
    req_patient = Patient.objects.get(pk=patient_id)
    
    if Appointment.objects.filter(
    Q(doctor=req_doctor, appointment_time=appointment_time) |
    Q(patient=req_patient, appointment_time=appointment_time)).exists():
        return HttpResponseBadRequest("Doctor or patient already has an appointment at the requested time", status=400)
    
    if request.user.is_doctor:
        if request.user.id != req_doctor.user.id:
            return HttpResponseForbidden("Cannot make appointment for different doctor")
    else:
        if request.user.id != req_patient.user.id:
            return HttpResponseForbidden("Cannot make appointment for different patient")
    try:
        appointment = Appointment.objects.create(appointment_time=appointment_time,doctor=req_doctor,patient=req_patient,patient_notes=patient_notes,doctor_notes=doctor_notes)
        appointment.save
        response_data = {
                'success': True,
                'message': 'Appointment created successfully',
                'id': appointment.id
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
def cancel_appointment(request,appointment_id):
    if request.method == 'DELETE':
        appointment = get_object_or_404(Appointment,pk=appointment_id)
        req_user = request.user
        if req_user.is_doctor:
            req_doctor = Doctor.objects.get(user=req_user)
            if appointment.doctor.id != req_doctor.id:
                return HttpResponseForbidden("Can only delete a user's own appointments") 
        else:
            req_patient = Patient.objects.get(user=req_user)
            if appointment.patient.id != req_patient.id:
                return HttpResponseForbidden("Can only delete a user's own appointments")
            
        appointment.delete()
        return JsonResponse({'message': 'Appointment deleted successfully.'}, status=204)
    else:
        return HttpResponseNotAllowed(["DELETE"])