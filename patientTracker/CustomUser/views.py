import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseForbidden, JsonResponse, HttpResponseBadRequest
from doctor.models import Doctor
from django.forms.models import model_to_dict
from patient.models import Patient
from rest_framework_simplejwt.tokens import RefreshToken

import json


@csrf_exempt
def auth_user(request):

    try:
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
    except:
        return HttpResponseBadRequest()
    user = authenticate(username=username,password=password)
    
    if user:
        id = None
        return_obj = None
        user_obj = model_to_dict(user)
        if(user.is_doctor):
            doctor = Doctor.objects.get(user=user)
            return_obj = {"CustomUser": user_obj,
                        "Doctor": model_to_dict(doctor)}
        else:
            patient = Patient.objects.get(user=user)
            return_obj = {"CustomUser": user_obj,
                        "Patient": model_to_dict(patient)}
        login(request,user)
        refresh = RefreshToken.for_user(user)
        return_obj['refresh'] = str(refresh)
        return_obj['access'] = str(refresh.access_token)
        login(request, user)
        return JsonResponse(return_obj, status=200)
    # if user:
    #     id = None
    #     return_obj = None
    #     user_obj = model_to_dict(user)
    #     if(user.is_doctor):
    #         doctor = Doctor.objects.get(user=user)
    #         return_obj = {"CustomUser": user_obj,
    #                       "Doctor": model_to_dict(doctor)}
    #     else:
    #         patient = Patient.objects.get(user=user)
    #         return_obj = {"CustomUser": user_obj,
    #                       "Patient": model_to_dict(patient)}
    #     login(request,user)
    
    #     return JsonResponse(return_obj,status=200)
    else:       
        return HttpResponseForbidden()
    
@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"message":"Logged out successfully!"},status=200)
