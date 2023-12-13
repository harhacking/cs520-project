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
  const [date, setDate] = useState("");
  const [aptReqDate, setAptReqDate] = useState("");

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

  function parseDate(milliseconds) {
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const formattedDate = `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year < 10 ? "0" + year : year}`;
    return formattedDate;
  }

  function changeFormat(dateString) {
    const dateArray = dateString.split("-");
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0].substring(2)}`;
  }

  function renderAppointments(appointmentsList, filterDate) {
    return appointmentsList
      .filter((appointment) =>
        filterDate
          ? parseDate(appointment.props.appointmentTime) ===
            changeFormat(filterDate)
          : appointment.props.is_accepted === true
      )
      .map((appointment) => appointment);
  }

  return (
    <div className={classes.doctorDashboardContainer}>
      {acceptedAppointments.length > 0 && (
        <div className={classes.acceptedAppointments}>
          <div className={classes.filterDateContainer}>
            <span>Filter By - </span>
            <input
              type="date"
              onChange={(e) => setAptReqDate(e.target.value)}
            />
            <button onClick={() => setAptReqDate("")}>Reset</button>
          </div>
          <h2>Appointment Requests</h2>
          {acceptedAppointments.map((appointment) => appointment)}
          {renderAppointments(appointments, aptReqDate)}
        </div>
      )}
      {toastMessage && <Toast isErrorMessage={false}>{toastMessage}</Toast>}
      <Navbar is_doctor={isDoctor} />

      {acceptedAppointments.length > 0 && (
        <div className={classes.allAppointments}>
          <div className={classes.filterDateContainer}>
            <span>Filter By - </span>
            <input type="date" onChange={(e) => setDate(e.target.value)} />
            <button onClick={() => setDate("")}>Reset</button>
          </div>
          <h2>Accepted Appointments</h2>

          {renderAppointments(appointments, date)}
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;
