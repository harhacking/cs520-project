import React from "react";
import axios from "axios";
import axiosInstance from "../Components/AxiosInstance";
import classes from "../Styles/Modal.module.css";
import { useState } from "react";

function Modal(props) {
  let { doctorsList, setModal } = props;

  const [appointmentdateTime, setAppointmentDateTime] = useState("");
  const [appointmentStartTime, setAppointmentStartTime] = useState("");
  const [appointmentEndTime, setAppointmentEndTime] = useState("");
  const [availableAppointments, setAvailableAppointments] = useState([]);

  const [patient_notes, setPatientNotes] = useState("");
  const [doctor_id, setDoctorId] = useState("");
  const [error, setError] = useState("");

  const patient_id = localStorage.getItem("patientId");

  let doctorsMap = {};
  doctorsList.forEach((doctor) => {
    doctorsMap[doctor.id] = doctor;
  });

  const milliseconds = Date.parse(appointmentdateTime);

  function parseDate(milliseconds) {
    const date = new Date(milliseconds);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedDate = `${day < 10 ? "0" + day : day}/${
      month < 10 ? "0" + month : month
    }/${year < 10 ? "0" + year : year}`;
    const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }`;
    return formattedDate + " " + formattedTime;
  }
  function createAppointment() {
    const data = {
      patient_id,
      doctor_id,
      patient_notes,
      appointment_time: milliseconds,
      is_accepted: false,
    };
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://127.0.0.1:8000/api/appointment/create/",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setModal(false);
        props.getAppointments();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getAvailableAppointments() {
    axiosInstance
      .get(`api/appointment/${doctor_id}/`, {
        params: {
          start_time: appointmentStartTime
            ? Date.parse(appointmentStartTime)
            : "",
          end_time: appointmentEndTime
            ? Date.parse(appointmentEndTime)
            : Date.parse(Date.now()),
        },
      })
      .then((res) => {
        const available_times = [];
        res.data.available_times.forEach((ms) => {
          available_times.push(
            new Date(ms)
              .toLocaleString("en-US", { timeZone: "UTC" })
              .replace(",", "")
          );
        });
        setAvailableAppointments(available_times);
      })
      .catch((e) => {
        setError(e.response.data.error)
        console.log(e);
      });
  }

  return (
    <div className={classes.modalContainer}>
      <div className={classes.modal}>
        <div className={classes.closeBtn} onClick={() => setModal(false)}>
          X
        </div>
        <div className={classes.formContainer}>
          <div className={classes.formElement}>
            <p className={classes.text}>Patient Notes</p>
            <textarea
              onChange={(e) => setPatientNotes(e.target.value)}
              placeholder="Describe your condition at length. 
            Include symptoms, concerns, or experiences you'd like to share. This information will help us better understand and address your health needs"
            ></textarea>
          </div>
          <div className={classes.formElement}>
            <p className={classes.text}>Select a doctor</p>
            <div className={classes.dropdownContainer}>
              {doctorsList.map((doctor) => {
                return (
                  <div
                    style={
                      doctor_id === doctor.id
                        ? { background: "#0084ff", color: "white" }
                        : null
                    }
                    onClick={() => setDoctorId(doctor.id)}
                    key={doctor.id}
                    id={doctor.id}
                  >
                    <p>Name: {doctor.name}</p>
                    <p>Specialization: {doctor.specialization}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={classes.dateTime}>
          <span>Start Date: </span>
          <input
            name="start_time"
            type="date"
            onChange={(e) => {
              setAppointmentStartTime(e.target.value);
            }}
          />
          <span>End Date: </span>
          <input
            name="end"
            type="date"
            onChange={(e) => {
              setAppointmentEndTime(e.target.value);
            }}
          />
        </div>
        <div className={classes.availableAppointments}>
          {availableAppointments &&
            availableAppointments.map((availableAppointment) => {
              return (
                <div
                  key={availableAppointment}
                  name={availableAppointment}
                  onClick={(e) =>
                    setAppointmentDateTime(e.target.getAttribute("name"))
                  }
                >
                  {availableAppointment}
                </div>
              );
            })}
        </div>
        {error && <p className={classes.errorMessage}>{error}</p>}
        <button
          onClick={getAvailableAppointments}
          disabled={
            appointmentStartTime === "" ||
            appointmentEndTime === "" ||
            doctor_id === ""
          }
        >
          Check Available Slots
        </button>
        <button onClick={createAppointment}>Submit</button>
        {appointmentdateTime && patient_notes && (
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              textDecoration: "underline",
              textDecorationColor: "#1ED760",
            }}
          >
            You're booking an appointment with Dr. {doctorsMap[doctor_id].name}{" "}
            on {appointmentdateTime}
          </p>
        )}
      </div>
    </div>
  );
}
export default Modal;
