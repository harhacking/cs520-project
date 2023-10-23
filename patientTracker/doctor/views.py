import json
from django.shortcuts import render
from CustomUser.models import CustomUser
from django.http import JsonResponse, HttpResponseNotAllowed
from .models import Doctor
from django.views.decorators.csrf import csrf_exempt


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