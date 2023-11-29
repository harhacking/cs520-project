import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "../Styles/PatientDashboard.module.css";

function PatientDashboard() {
  const patientId = parseInt(localStorage.getItem("patientId"));
  const doctorId = 6;
  const data = {
    patientId,
    doctorId,
    patient_notes: "Sussy baka",
  };

  console.log(data);

  function createAppointment() {
    axios
      .post(
        "http://127.0.0.1:8000/api/appointment/create/",
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div>
      <button onClick={createAppointment}>Create Appointment</button>
    </div>
  );
}

export default PatientDashboard;
