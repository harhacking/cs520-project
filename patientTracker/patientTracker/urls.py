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
from doctor.views import view_patient_details,doctor_appointments,register_doctor,doctor_details,list_doctors
from appointment.views import available_appointment_times, create_appointment,cancel_appointment,update_notes, accept_appointment
from patient.views import patient_details,register_patient,patient_appointments
from CustomUser.views import auth_user,logout_user,isAuth

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/',auth_user),
    path('isAuth/',isAuth),

    path('logout/',logout_user),
    
    path('api/doctor/register/',register_doctor,name="register doctor"),
    path('api/doctor/appointments/', doctor_appointments, name='doctor_appointments'),
    path('api/doctor/details/',doctor_details),
    path('api/doctor/list/',list_doctors),
    path('api/doctor/view/patient/<int:patient_id>/', view_patient_details),


    path('api/patient/details/',patient_details),
    path('api/patient/register/',register_patient),
    path('api/patient/appointments/',patient_appointments),
  
    path('api/appointment/create/', create_appointment),
    path('api/appointment/accept/<int:appointment_id>',accept_appointment),
    path('api/appointment/update/<int:appointment_id>/note/', update_notes),
    path('api/appointment/cancel/<int:appointment_id>',cancel_appointment),
    path('api/appointment/<int:doctor_id>/',available_appointment_times)

]
