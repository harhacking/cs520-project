from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from doctor.models import Doctor
from django.db.models import Q
from datetime import datetime, timedelta
from .models import Appointment





def epoch_milliseconds_to_datetime(epoch_milliseconds):
    return datetime.utcfromtimestamp(epoch_milliseconds / 1000.0)


@login_required
def available_appointment_times(request, doctor_name):
    if request.method == "GET":
        try:
            doctor = Doctor.objects.get(name=doctor_name)
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
        current_time = datetime.utcnow()
        
        while current_time <= end_time and current_time.time() <= end_time.time():
            working_hours_start = datetime.combine(current_time.date(), datetime.strptime("09:00", "%H:%M").time())
            working_hours_end = datetime.combine(current_time.date(), datetime.strptime("17:00", "%H:%M").time())

            if working_hours_start.time() <= current_time.time() <= working_hours_end.time():
                if not appointments.filter(
                    Q(appointment_time__lte=current_time.timestamp() * 1000) &
                    Q(appointment_time__gte=(current_time - timedelta(hours=1)).timestamp() * 1000)
                ).exists():
                    available_times.append(current_time.timestamp() * 1000)

            current_time += timedelta(hours=1)

        return JsonResponse({"available_times": available_times})
