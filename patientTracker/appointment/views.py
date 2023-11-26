from django.shortcuts import render
from django.http import JsonResponse, HttpResponseForbidden
from doctor.models import Doctor
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Appointment


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
        
        while current_time <= end_time and current_time.time() <= end_time.time():
            working_hours_start = datetime.combine(current_time.date(), datetime.strptime("09:00", "%H:%M").time())
            working_hours_end = datetime.combine(current_time.date(), datetime.strptime("16:00", "%H:%M").time())
            
            if working_hours_start.time() <= current_time.time() <= working_hours_end.time():
                curr_timestamp = int(current_time.timestamp())*1000
                if not appointments.filter(
                     Q(appointment_time__gt=curr_timestamp - ms_hour, appointment_time__lt=curr_timestamp + ms_hour)
                ).exists():
                    available_times.append(curr_timestamp)

            current_time += timedelta(hours=1)

        return JsonResponse({"available_times": available_times})
