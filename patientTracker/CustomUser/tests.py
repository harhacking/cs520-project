from django.test import TestCase

import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from doctor.models import Doctor
from patient.models import Patient

class AuthTestCase(TestCase):
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

    def test_auth_user_doctor(self):
        auth_data = {
            'username': 'doctoruser',
            'password': 'testpassword',
        }
        auth_url = '/auth/'
        response = self.client.post(auth_url, json.dumps(auth_data), content_type='application/json')

        self.assertEqual(response.status_code, 200)

        auth_response = json.loads(response.content)

        # Perform assertions on the response
        self.assertIn('CustomUser', auth_response)
        self.assertIn('Doctor', auth_response)
        self.assertIn('token', auth_response)

    def test_auth_user_patient(self):
        auth_data = {
            'username': 'patientuser',
            'password': 'testpassword',
        }
        auth_url = '/auth/'  
        response = self.client.post(auth_url, json.dumps(auth_data), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        
        auth_response = json.loads(response.content)

        self.assertIn('CustomUser', auth_response)
        self.assertIn('Patient', auth_response)
        self.assertIn('token', auth_response)

    def test_logout_user(self):
        # Log in a user (doctor in this case)
        self.client.force_login(self.doctor_user)

        logout_url = '/logout/'  
        response = self.client.post(logout_url)

        self.assertEqual(response.status_code, 200)

        logout_response = json.loads(response.content)

        self.assertIn('message', logout_response)
        self.assertEqual(logout_response['message'], 'Logged out successfully!')
