"""patientTracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from doctor.views import doctor_appointments,register_doctor,doctor_details
from patient.views import patient_details
from appointment.views import available_appointment_times
from CustomUser.views import auth_user,logout_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/doctor/register/',register_doctor,name="register doctor"),
    path('api/doctor/appointments/', doctor_appointments, name='doctor_appointments'),
    path('api/doctor/details/',doctor_details),
    path('api/patient/details/',patient_details),
    path('api/appointment/<int:doctor_id>/',available_appointment_times),
    path('auth/',auth_user),
    path('logout/',logout_user)
    
    
]
