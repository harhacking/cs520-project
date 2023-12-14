### API Description

#### Authorization
 **auth/** - POST request requiring `username` and `password` in request body. Returns an object containing all information about that user if authorized else returns a 403

**logout/** - POST request, logs out a current user

#### Doctor
 **api/doctor/register/** - POST request requiring `first_name`,`last_name`,`username`,`password`,`email` and `specialization`. If successful, will return an object in the form `{success: boolean,message: string, id: int}` where id is the doctor's id. If failed it will return an object of the same shape with 400 status code.

 **api/doctor/appointments/** - GET request requiring user to be logged in. Has optional fields `start_time` and `end_time` if you want to limit the time of the appointments. All times must be in Epoch Millisecond form. On success, will return an object in the form `{appointments: Appointment[]}`. On failure will return a 404.

 **api/doctor/details/** - (2 methods) GET request that returns all information for the current user. User must be logged in and be a doctor or else a 403 or 404 is returned. PUT request updates information for a user. User must be logged in and a doctor. The body of the request is a json and contains any fields you want to update. 

**api/doctor/list/** - GET request requiring a user to be logged in. Will return a list of all doctors to be used when a patient is creating an appointment and needs to choose a doctor. Will return an object in the form: `{'doctors': [{'name': 'firstName lastName', 'specialization': 'doctorSpecialization' : 'id': doctor_id}]`. 

**api/doctor/view/patient/\<int:patient_id\>/** - GET request requiring a user to be logged in and a doctor. Returns the patient's information similarly to the `api/patient/details/` endpoint.
 
 #### Patient 
 
  **api/patient/register/** - POST request requiring `first_name`,`last_name`,`username`,`password`,`email`, `medical_history`, `medications`,`diagnoses`, `blood_group`, `height`, `weight`(height is cm, weight is lbs). If successful, will return an object in the form `{success: boolean,message: string, id: int}` where id is the patient's id. If failed it will return an object of the same shape with 400 status code.

 **api/patient/appointments/** - GET request requiring user to be logged in. Has optional fields `start_time` and `end_time` if you want to limit the time of the appointments. All times must be in Epoch Millisecond form. On success, will return an object in the form `{appointments: Appointment[]}`. On failure will return a 404.

 **api/patient/details/** - (2 methods) GET request that returns all information for the current user. User must be logged in and be a patient or else a 403 or 404 is returned. PUT request updates information for a user. User must be logged in and a patient. The body of the request is a json and contains any fields you want to update. 
 
 #### Appointment
 
 **api/appointment/create/** - POST request that requires a user to be logged in. The request body must include `patient_id`, `doctor_id`, `appointment_time` (in Epoch milliseconds), `patient_notes`, and optionally `doctor_notes`. If successful then `{
                'success': True,
                'message': 'Appointment created successfully',
                'id': appointment_id
            }` will be returned. 

 **api/appointment/\<int:doctor_id\>/** - GET request that requires query params `start_time` and `end_time` (in Epoch milliseconds) and will return all available appointment times for a doctor inside the time constraints. Assumes that all appointments are 1 hour long and appointments can only occur Mon-Fri from 9 am to 4pm (4 because last appointment will be 4-5pm). 

 **api/appointment/cancel/\<int:appointment_id\>** - DELETE request that requires a user to be logged in and must be either the patient or doctor associated with the appointment. Will delete the associated appointment and return a message noting that it has successfully been deleted.

**api/appointment/update/\<int:appointment_it\>/note/** - PUT request that requires a user to be logged in. Allows a user to update either the patient notes or doctors note (a patient can only update patient_notes and doctor can only update doctor_notes). The user must be either the patient or doctor associated with the appointment to be able to update it. Returns a message saying that the note has been successfully updated.

**api/appointment/accept/<int:appointment_id>** - POST request that requires a user to be logged in and the Doctor for the given appointment id. Hitting this endpoint accepts the appointment and changes that `is_accepted` field in the Appointments table. Returns a 200 status code with a message saying the appointment acceptance was a success or a 400 if the user is not the correct Doctor for the appointment.
   
 
 