import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import AppointmentCard from "../Components/AppointmentCard";
import axios from "axios";
import classes from "../Styles/PatientDashboard.module.css";
import Modal from "../Components/Modal";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [modal, setModal] = useState(false);
  const token = localStorage.getItem("token");

  function getAppointments() {
    console.log("getting appts...")
    axios
      .get("http://127.0.0.1:8000/api/patient/appointments/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAppointments(res.data.appointments);
      });
  }

  function getDoctors() {
    axios
      .get("http://127.0.0.1:8000/api/doctor/list/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDoctorsList(res.data.doctors);
      });
  }

  function cancelAppointment(id) {
    axios
      .delete(`http://127.0.0.1:8000/api/appointment/cancel/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert("appointment deleted");
        getAppointments();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    getAppointments();
    getDoctors();
  }, []);

  return (
    <div className={classes.patientDashboardContainer}>
      <Navbar />
      <button onClick={() => setModal(true)}>Create Appointment</button>
      {modal && (
        <Modal
          setModal={setModal}
          doctorsList={doctorsList}
          getAppointments={getAppointments}
        />
      )}
      {appointments.map((appointment, index) => (
        <AppointmentCard
          key={appointment.id}
          doctor_name={appointment.doctor_name}
          patient_notes={appointment.patient_notes}
          doctor_notes={appointment.doctor_notes}
          isPatient={true}
          cancelAppointment={cancelAppointment}
          appointmentId={appointment.id}
          appointmentTime={appointment.appointment_time}
          getAppointments={getAppointments}
        />
      ))}
    </div>
  );
}

export default PatientDashboard;
