#!/bin/bash

# Start the frontend
cd patient_tracker_fe
npm start &

# Store the process ID of the frontend server
frontend_pid=$!

# back to project directory
cd ..

# Start the backend server
cd patientTracker
python3 manage.py runserver &

# Store the process ID of the backend server
backend_pid=$!

# so ctrl c kills both
# Wait for both servers to finish and capture Ctrl+C
trap 'kill $frontend_pid; kill $backend_pid' SIGINT

# Wait for both background processes
wait
