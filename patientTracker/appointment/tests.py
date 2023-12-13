import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from doctor.models import Doctor
from patient.models import Patient
from appointment.models import Appointment

class AppointmentViewsTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.doctor_user = get_user_model().objects.create_user(
            username='doctoruser',
            password='testpassword',
            email='doctor@example.com',
            is_doctor=True,
        )

        self.patient_user = get_user_model().objects.create_user(
            username='patientuser',
            password='testpassword',
            email='patient@example.com',
        )

        
        self.patient = Patient.objects.create(user=self.patient_user,medical_history="",medications="",diagnoses="",blood_group="",height=1,weight=1)
        self.doctor = Doctor.objects.create(user=self.doctor_user, specialization='Test Specialization')
        self.doctor_token = self.get_authentication_token(self.doctor_user)
        self.patient_token = self.get_authentication_token(self.patient_user)
        
        self.appointment = Appointment.objects.create(
            doctor=self.doctor,
            patient=self.patient,
            appointment_time=1672531199000,
        )
    def get_authentication_token(self,user):
        auth_data = {
            'username': user.username,
            'password': 'testpassword',
        }

        auth_url = '/auth/'  
        response = self.client.post(auth_url, json.dumps(auth_data), content_type='application/json')

        self.assertEqual(response.status_code, 200)

        auth_response = json.loads(response.content)
        return auth_response.get('token')

    def test_available_appointment_times(self):
        url = f'/api/appointment/{self.doctor.id}/'
        headers = {'HTTP_AUTHORIZATION': f"Token {self.patient_token}"}
        response = self.client.get(url, {'start_time': '1672531199000', 'end_time': '1672617599000'},**headers)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('available_times', data)
        

    def test_create_appointment(self):
        headers = {'HTTP_AUTHORIZATION': f"Token {self.patient_token}"}
        url = '/api/appointment/create/'

        appointment_data = {
            'patient_id': self.patient.id,
            'doctor_id': self.doctor.id,
            'appointment_time': 10,
            'patient_notes': 'Patient notes',
            'doctor_notes': 'Doctor notes',
        }

        response = self.client.post(url, json.dumps(appointment_data), content_type='application/json',**headers)

        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content)
        self.assertIn('success', data)
        self.assertTrue(data['success'])

    def test_accept_appointment(self):
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        url = f'/api/appointment/accept/{self.appointment.id}'

        response = self.client.post(url,**headers)

        # Check if the appointment acceptance was successful
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('msg', data)
        self.assertEqual(data['msg'], 'Appointment accepted successfully')

    def test_update_notes(self):
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        url = f'/api/appointment/update/{self.appointment.id}/note/'

        # Prepare data for updating notes
        notes_data = {'doctor_notes': 'Updated doctor notes'}

        response = self.client.put(url, json.dumps(notes_data), content_type='application/json',**headers)

        # Check if the notes update was successful
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Notes updated successfully')

    def test_cancel_appointment(self):
        headers = {'HTTP_AUTHORIZATION': f"Token {self.patient_token}"}
        url = f'/api/appointment/cancel/{self.appointment.id}'

        response = self.client.delete(url,**headers)

        # Check if the appointment cancellation was successful
        self.assertEqual(response.status_code, 204)
