import React from "react";
import axios from "axios";
import classes from "../Styles/Modal.module.css";
import { useState } from "react";

function Modal(props) {
  let { doctorsList, setModal } = props;
  const [appointmentdateTime, setAppointmentDateTime] = useState("");
  const [patient_notes, setPatientNotes] = useState("");
  const [doctor_id, setDoctorId] = useState("");
  const patient_id = localStorage.getItem("patientId");

  let doctorsMap = {};
  doctorsList.forEach((doctor) => {
    doctorsMap[doctor.id] = doctor;
  });

  const milliseconds = Date.parse(appointmentdateTime);

  function createAppointment() {
    const data = {
      patient_id,
      doctor_id,
      patient_notes,
      appointment_time: milliseconds,
      is_accepted:false
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
          <input
            type="datetime-local"
            onChange={(e) => {
              setAppointmentDateTime(e.target.value);
            }}
          />
        </div>
        {appointmentdateTime && patient_notes && (
          <p
            style={{
              textAlign: "center",
              fontSize: "14px",
              textDecoration: "underline",
              textDecorationColor: "#1ED760",
            }}
          >
            You're booking an appointment with Dr. {doctorsMap[doctor_id].name}
            on {appointmentdateTime}
          </p>
        )}
        <button onClick={createAppointment}>Submit</button>
      </div>
    </div>
  );
}
export default Modal;
