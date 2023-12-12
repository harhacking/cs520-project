from django.test import TestCase

import json
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Patient
from appointment.models import Appointment

class PatientTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        # Create a patient user
        self.patient_user = get_user_model().objects.create_user(
            username='patientuser',
            password='testpassword',
            email='patient@example.com',
        )

        # Obtain and store the token for the patient user
        self.patient = Patient.objects.create(user=self.patient_user,medical_history="",medications="",diagnoses="",blood_group="",height=1,weight=1)
        self.token = self.get_authentication_token(self.patient_user)

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

    def test_patient_appointments(self):
        if self.token:
            headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

            appointments_url = '/api/patient/appointments/'
            response = self.client.get(appointments_url, **headers)

            self.assertEqual(response.status_code, 200)
            data = json.loads(response.content)
            self.assertIn('appointments', data)
        else:
            self.fail('No token found during setup')

    def test_patient_details(self):
        if self.token:
            headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

            details_url = '/api/patient/details/'
            response = self.client.get(details_url, **headers)

            self.assertEqual(response.status_code, 200)
            data = json.loads(response.content)
            self.assertIn('CustomUser', data)
            self.assertIn('Patient', data)
        else:
            self.fail('No token found during setup')

    def test_update_patient_details(self):
        if self.token:
            headers = {'HTTP_AUTHORIZATION': f'Bearer {self.token}'}

            update_data = {
                'diagnoses': 'Updated Diagnoses',
                'blood_group': 'AB',
                'height': 170,
                'weight': 65,
                'medications': 'Updated Medications',
                'medical_history': 'Updated Medical History',
            }

            # Use the token to make requests to update patient details endpoint
            update_url = '/api/patient/details/'
            response = self.client.put(update_url, json.dumps(update_data), content_type='application/json', **headers)

            # Perform assertions on the response
            self.assertEqual(response.status_code, 200)
            data = json.loads(response.content)
            self.assertIn('message', data)

        else:
            self.fail('No token found during setup')


