# cs520-project
cs520 semester long project


#API Description
 auth/ - POST request requiring `username` and `password` in request body. Returns an object containing all information about that user if authorized else returns a 403
 api/doctor/register - POST request requiring `first_name`,`last_name`,`username`,`password`,`email` and `specialization`. If successful, will return an object in the form `{success: boolean,message: string, id: int}` where id is the doctor's id. If failed it will return an object of the same shape with 400 status code.
 api/doctor/appointment - GET request requiring user to be logged in. Has optional fields `start_time` and `end_time` if you want to limit the time of the appointments. All times must be in Epoch Millisecond form. On success, will return an object in the form `{appointments: Appointment[]}`. On failure will return a 404.
