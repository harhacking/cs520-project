import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import AppointmentCard from "../Components/AppointmentCard";
import axios from "axios";
import classes from "../Styles/DoctorDashboard.module.css";
import Toast from "../Components/Toast";
import { useLocation } from "react-router";

function DoctorDashboard() {
  const { state } = useLocation();
  const isDoctor = state.isDoctor;
  const doctor_id = localStorage.getItem("doctorId");
  const [appointments, setAppointments] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);

  const token = localStorage.getItem("token");

  const get_appointments_url = isDoctor
    ? `http://127.0.0.1:8000/api/doctor/appointments/`
    : `http://127.0.0.1:8000/api/patient/appointments/`;

  function getAppointments() {
    axios
      .get(get_appointments_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const appointmentsJSX = res.data.appointments.map((appointment) => {
          return (
            <AppointmentCard
              key={appointment.id}
              doctor_id={doctor_id}
              doctor_name={appointment.doctor_name}
              patient_name={appointment.patient_name}
              patient_notes={appointment.patient_notes}
              doctor_notes={appointment.doctor_notes}
              isPatient={!isDoctor}
              //   cancelAppointment={cancelAppointment}
              appointmentId={appointment.id}
              appointmentTime={appointment.appointment_time}
              getAppointments={getAppointments}
              isDoctorNote={appointment?.doctor_notes}
              setToastMessage={setToastMessage}
              is_accepted={appointment.is_accepted}
            />
          );
        });
        setAppointments(appointmentsJSX);

        const acceptedAppointmentsJSX = [];

        res.data.appointments.forEach((appointment) => {
          if (appointment.is_accepted === false) {
            acceptedAppointmentsJSX.push(
              <AppointmentCard
                key={appointment.id}
                doctor_id={doctor_id}
                doctor_name={appointment.doctor_name}
                patient_name={appointment.patient_name}
                patient_notes={appointment.patient_notes}
                doctor_notes={appointment.doctor_notes}
                isPatient={!isDoctor}
                appointmentId={appointment.id}
                appointmentTime={appointment.appointment_time}
                getAppointments={getAppointments}
                isDoctorNote={appointment?.doctor_notes}
                setToastMessage={setToastMessage}
                is_accepted={appointment.is_accepted}
              />
            );
          }
          setAcceptedAppointments(acceptedAppointmentsJSX);
        });
      });
  }

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    if (toastMessage !== "") {
      setTimeout(() => {
        setToastMessage("");
      }, 2000);
    }
  }, [toastMessage]);
  return (
    <div className={classes.doctorDashboardContainer}>
      {acceptedAppointments.length > 0 && (
        <div className={classes.acceptedAppointments}>
          <h2>Appointment Requests</h2>
          {acceptedAppointments.map((appointment) => {
            return appointment;
          })}
        </div>
      )}
      {toastMessage && <Toast isErrorMessage={false}>{toastMessage}</Toast>}
      <Navbar is_doctor={isDoctor} />

      <div className={classes.allAppointments}>
        <h2>Accepted Appointments</h2>
        {appointments.filter((appointment) => {
          return appointment.props.is_accepted === true;
        })}
      </div>
    </div>
  );
}

export default DoctorDashboard;
