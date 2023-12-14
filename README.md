# cs520-project

### Overview
This project is a new doctor/patient portal, made for the ease of communication and scheduling appointments. It is composed of a frontend and a backend, each with their directories in this repository as patient_tracker_fe and patientTacker respectively. (We do notice a better naming convention could've been used.)

## how to run
**Frontend**
The frontend runs on react, as such make sure npm is installed (can be found here [npm install](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). After that is on your system go into the frontend directory and run the following comment "npm install". This will install any dependencies our project has, allowing you to run it

**Backend**
The backend runs on python, make sure that is installed. Once it is, go into the backend directory and run "pip install -r requirements.txt". This will install most of the dependencies for the backend. However you will not be able to run the backend as you need a *.env* file we are not providing. This file included the fields "DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT, DB_USER, FIELD_ENCRYPTION_KEY". This allows for secure communication with the database.

**Running both**
Once all dependencies are installed, in the topmost directory, you can simply run "run.sh" to start both of them up at the same time. Or you can start them independently by going into the backend directory and running "python manage.py runserver" and then going to the frontend directory and running "npm start". To stop either, simply ctrl c 
