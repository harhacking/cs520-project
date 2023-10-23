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
from django.urls import path,include
from patient.views import doctor_dashboard
<<<<<<< HEAD
from doctor.views import doctor_appointments
=======
from CustomUser.views import auth_user
from doctor.views import register_doctor
>>>>>>> main

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard',doctor_dashboard,name="dashboard"),
<<<<<<< HEAD
    path('api/doctor/<int:doctor_id>/appointments/', doctor_appointments, name='doctor_appointments')
=======
    path('auth/',auth_user),
    path('api/doctor/register',register_doctor,name="register doctor")
>>>>>>> main
    
]
