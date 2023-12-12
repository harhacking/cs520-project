import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import AppointmentCard from "../Components/AppointmentCard";
import classes from "../Styles/PatientDashboard.module.css";
import Modal from "../Components/Modal";
import { useLocation, useNavigate } from "react-router";
import axiosInstance from "../Components/AxiosInstance";

function PatientDashboard() {
  const {state} = useLocation()
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [modal, setModal] = useState(false);

  function getAppointments() {
    const start_time = new Date().getTime();

    axiosInstance
      .get("api/patient/appointments/", {
        params: {
          start_time: start_time,
        },
      })
      .then((res) => {
        setAppointments(res.data.appointments);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 403) {
          navigate("/");
        }
      });
  }

  function getPastAppointments() {
    const end_time = new Date().getTime();

    axiosInstance
      .get("api/patient/appointments/", {
        params: {
          end_time: end_time,
        },
      })
      .then((res) => {
        setPastAppointments(res.data.appointments);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 403) {
          navigate("/");
        }
      });
  }

  function getDoctors() {
    axiosInstance
      .get("api/doctor/list/")
      .then((res) => {
        setDoctorsList(res.data.doctors);
      })
      .catch((error) => {
        const status = error.response.status;
        if (status === 403) {
          navigate("/");
        }
      });
  }

  function cancelAppointment(id) {
    axiosInstance
      .delete(`api/appointment/cancel/${id}`)
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
    getPastAppointments();
    getDoctors();
  }, []);

  return (
    <div className={classes.patientDashboardContainer}>
      <button onClick={() => setModal(true)}>Create Appointment</button>

      <div className={classes.pastAppointments}>
        <h2>Past Appointments</h2>

        {pastAppointments.map((appointment, index) => (
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
            pastAppointment={true}
          />
        ))}
      </div>
      <Navbar username={state.username} is_doctor={state.is_doctor}/>
      {modal && (
        <Modal
          setModal={setModal}
          doctorsList={doctorsList}
          getAppointments={getAppointments}
        />
      )}
      <div className={classes.upcomingAppointments}>
        <h2>Upcoming Appointments</h2>
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
    </div>
  );
}

export default PatientDashboard;
