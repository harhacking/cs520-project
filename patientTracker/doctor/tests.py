import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Doctor
from appointment.models import Appointment
from patient.models import Patient

class DoctorTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            email='test@example.com',
            is_doctor= True
        )
        self.user2 = get_user_model().objects.create_user(
            username='testuser2',
            password='testpassword',
            email='test2@example.com',
            is_doctor=False
        )
        self.patient = Patient.objects.create(user=self.user2,medical_history="",medications="",diagnoses="",blood_group="",height=1,weight=1)
        self.doctor = Doctor.objects.create(user=self.user, specialization='Test Specialization')
        self.doctor_token = self.get_authentication_token(self.user)

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
    
    def test_doctor_appointments(self):
        
        appointment = Appointment.objects.create(doctor=self.doctor,patient=self.patient,appointment_time=100)
        url = '/api/doctor/appointments/'
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        
        response = self.client.get(url)
        self.assertEqual(response.status_code,403)
        
        response = self.client.get(url, **headers)

        # Perform assertions on the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('appointments', data)
        
        self.assertEqual(len(data['appointments']),1)

    def test_view_patient_details(self):
        # Set up a patient and call the view
        url = f'/api/doctor/view/patient/{self.patient.id}/'
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        response = self.client.get(url, **headers)

        # Perform assertions on the response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('CustomUser', data)
        self.assertIn('Patient', data)

    def test_doctor_details(self):
        url = '/api/doctor/details/'
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        response = self.client.get(url, **headers)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('CustomUser', data)
        self.assertIn('Doctor', data)

    def test_register_doctor(self):
        url = '/api/doctor/register/'
        response = self.client.post(url, {'first_name': 'John', 'last_name': 'Doe', 'username': 'john.doe',
                                          'password': 'testpassword', 'email': 'john.doe@example.com',
                                          'specialization': 'Test Specialization'})

        self.assertIn(response.status_code, [201, 400])
        data = json.loads(response.content)
        if response.status_code == 201:
            self.assertTrue(data['success'])
            self.assertIn('id', data)
        elif response.status_code == 400:
            self.assertFalse(data['success'])
            self.assertIn('message', data)

    def test_list_doctors(self):
        url = '/api/doctor/list/'
        headers = {'HTTP_AUTHORIZATION': f"Token {self.doctor_token}"}
        response = self.client.get(url, **headers)

        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertIn('doctors', data)
        self.assertTrue(isinstance(data['doctors'], list))


