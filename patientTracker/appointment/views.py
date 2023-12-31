from django.shortcuts import render, get_object_or_404
from doctor.models import Doctor
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseBadRequest
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Appointment
from patient.models import Patient
from doctor.models import Doctor
from CustomUser.authenticate import check_token
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json


ms_hour = int(timedelta(hours=1).total_seconds() * 1000)

# convert epoch ms to datatime object
def epoch_milliseconds_to_datetime(epoch_milliseconds):
    return datetime.utcfromtimestamp(epoch_milliseconds / 1000)

# return available appointment times for a doctor in a time range
# assumes working hours are Mon-Fri 9am-5pm
def available_appointment_times(request, doctor_id):
    user = check_token(request)
    if not user:
        return HttpResponseForbidden("User is not authenticated")
    if request.method != "GET":
        return HttpResponseNotAllowed(["GET"]);
    
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

# creates an appointment
@csrf_exempt
def create_appointment(request):
    user = check_token(request)
    if not user:
        return HttpResponseForbidden("User is not authenticated")
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    
    
    try:
        data = json.loads(request.body)
        patient_id = data['patient_id']
        doctor_id = data['doctor_id']
        appointment_time = data['appointment_time']
        patient_notes = data.get('patient_notes',"")
        doctor_notes = data.get('doctor_notes',"")
    except:
        return HttpResponseBadRequest("Invalid request body", status=400)
    
    req_doctor = Doctor.objects.get(pk=doctor_id)
    req_patient = Patient.objects.get(pk=patient_id)
    
    if Appointment.objects.filter(
    Q(doctor=req_doctor, appointment_time=appointment_time) |
    Q(patient=req_patient, appointment_time=appointment_time)).exists():
        return HttpResponseBadRequest("Doctor or patient already has an appointment at the requested time", status=400)
    
    if user.is_doctor:
        if user.id != req_doctor.user.id:
            return HttpResponseForbidden("Cannot make appointment for different doctor")
    else:
        if user.id != req_patient.user.id:
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


# allows doctor to accept an appointment
@csrf_exempt
def accept_appointment(request,appointment_id):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    user = check_token(request)
    if not user:
        return HttpResponseForbidden("User is not authenticated")
    if not user.is_doctor:
        return HttpResponseBadRequest("Must be a doctor to accept an appointment")
    doctor = Doctor.objects.get(user=user)
    appointment = Appointment.objects.get(pk=appointment_id)
    if appointment.doctor.id != doctor.id:
        return HttpResponseBadRequest("Must be the doctor associated with the appointment to accept")
    appointment.is_accepted = True
    appointment.save()
    return JsonResponse({"msg":"Appointment accepted successfully"},status=200)
    
# allows user to update patient/doctor note
@csrf_exempt
def update_notes(request,appointment_id):
    appointment = get_object_or_404(Appointment,pk=appointment_id)
    if request.method != "PUT":
        return HttpResponseNotAllowed(["PUT"])
    user = check_token(request)
    if not user:
        return HttpResponseForbidden("User is not authenticated")
    data = json.loads(request.body)
    try:
        if user.is_doctor:
            doctor_notes = data['doctor_notes']
            appointment.doctor_notes = doctor_notes
        else:
            patient_notes = data['patient_notes']
            appointment.patient_notes = patient_notes
    except:
        return HttpResponseBadRequest("Must include patient_notes or doctor_notes")
    
    appointment.save()
    return JsonResponse({"message":"Notes updated successfully"},status=200)


# allows user to cancel their own appointment 
@csrf_exempt
def cancel_appointment(request,appointment_id):
    user = check_token(request)
    if not user:
        return HttpResponseForbidden("User is not authenticated")
    if request.method == 'DELETE':
        appointment = get_object_or_404(Appointment,pk=appointment_id)
        if user.is_doctor:
            req_doctor = Doctor.objects.get(user=user)
            if appointment.doctor.id != req_doctor.id:
                return HttpResponseForbidden("Can only delete a user's own appointments") 
        else:
            req_patient = Patient.objects.get(user=user)
            if appointment.patient.id != req_patient.id:
                return HttpResponseForbidden("Can only delete a user's own appointments")
            
        appointment.delete()
        return JsonResponse({'message': 'Appointment deleted successfully.'}, status=204)
    else:
        return HttpResponseNotAllowed(["DELETE"])

