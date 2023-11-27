from django.shortcuts import render, get_object_or_404
from doctor.models import Doctor
from django.http import JsonResponse, HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from patient.models import Patient
from .models import Appointment
import json

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
def update_notes(request,appointment_id):
    appointment = get_object_or_404(Appointment,pk=appointment_id)
    if request.method != "PUT":
        return HttpResponseNotAllowed(["PUT"])
    if not request.user.is_authenticated:
            return HttpResponseForbidden("User is not authenticated")
    data = json.loads(request.body)
    if request.user.is_doctor:
        doctor_notes = data['doctor_notes']
        appointment.doctor_notes = doctor_notes
    else:
        patient_notes = data['patient_notes']
        appointment.patient_notes = patient_notes
    
    appointment.save()
    return JsonResponse({"message":"Notes updated successfully"},status=200)