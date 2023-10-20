from django.shortcuts import render
from doctor.models import Doctor
from django.http import JsonResponse
from appointment.models import Appointment



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
    