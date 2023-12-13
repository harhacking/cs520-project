import json
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseForbidden, JsonResponse, HttpResponseBadRequest
from doctor.models import Doctor
from django.forms.models import model_to_dict
from patient.models import Patient
from rest_framework.authtoken.models import Token

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
        user_obj = model_to_dict(user)
        return_obj = {"CustomUser": user_obj}
        if(user.is_doctor):
            doctor = Doctor.objects.get(user=user)
            return_obj["Doctor"] = model_to_dict(doctor)
        else:
            patient = Patient.objects.get(user=user)
            return_obj["Patient"] = model_to_dict(patient)
        login(request,user)

        token,created = Token.objects.get_or_create(user=user)
        return_obj['token'] = token.key
        
        return JsonResponse(return_obj, status=200)
    else:       
        return HttpResponseBadRequest("The username and/or password is incorrect.")
    
@csrf_exempt
def logout_user(request):
    logout(request)
    return JsonResponse({"message":"Logged out successfully!"},status=200)
