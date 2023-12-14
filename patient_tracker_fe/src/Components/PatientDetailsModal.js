import React from "react";
import classes from "../Styles/PatientDetailsModal.module.css";

function PatientDetailsModal(props) {
  return (
    <div className={classes.patientDetailsModalContainer}>
      <div className={classes.patientDetailsModal}>
        <button onClick={() => props.setPatientDetailsModal(false)}>X</button>
        <p>
          <span>Height: </span>
          {props.patientData.height}
        </p>
        <p>
          <span>Weight: </span>
          {props.patientData.weight}
        </p>
        <p>
          <span>Blood Group: </span>
          {props.patientData.blood_group}
        </p>
        <p>
          <span>Diagnoses: </span>
          {props.patientData.diagnoses}
        </p>
        <p>
          <span>Medical History: </span>
          {props.patientData.medical_history}
        </p>
        <p>
          <span>Medications: </span>
          {props.patientData.medications}
        </p>
      </div>
    </div>
  );
}

export default PatientDetailsModal;
