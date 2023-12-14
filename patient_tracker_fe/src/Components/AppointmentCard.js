import { useState } from "react";
import classes from "../Styles/AppointmentCard.module.css";
import EditNotesModal from "./EditNotesModal";
import axios from "axios";
import axiosInstance from "./AxiosInstance";
import PatientDetailsModal from "./PatientDetailsModal";

function AppointmentCard(props) {
  const {
    doctor_name,
    doctor_id,
    patient_id,
    patient_name,
    patient_notes,
    doctor_notes,
    isPatient,
    appointmentId,
    appointmentTime,
    isDoctorNote,
    pastAppointment,
    fetchAppointments

  } = props;
  const [editNotesModal, setEditNotesModal] = useState(false);
  const [patientDetailsModal, setPatientDetailsModal] = useState(false);
  const [patientData, setPatientData] = useState({});

  const token = localStorage.getItem("token");

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

  function acceptAppointment() {
    axios
      .post(
        `http://127.0.0.1:8000/api/appointment/accept/${appointmentId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        fetchAppointments()
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function getPatientDetails() {
    axiosInstance.get(`api/doctor/view/patient/${patient_id}/`)
    .then(res => {
      setPatientData(res.data.Patient)
      setPatientDetailsModal(true)

    })
    .catch(e => console.log(e))
  }

  return (
    <div className={classes.aptCard}>
      {patientDetailsModal && <PatientDetailsModal patientData={patientData} 
      setPatientDetailsModal={setPatientDetailsModal}
      />}
      {editNotesModal && (
        <EditNotesModal
          setEditNotesModal={setEditNotesModal}
          appointmentId={appointmentId}
          patient_notes={patient_notes}
          doctor_notes={doctor_notes}
          getAppointments={props.getAppointments}
          isPatient={isPatient}
          setToastMessage={props.setToastMessage}
        />
      )}
      <div className={classes.profile}>
        <p>
          {isPatient && <span>Dr. {doctor_name}</span>}
          {!isPatient && <span onClick={getPatientDetails}>{patient_name}</span>}

          <span>{parseDate(appointmentTime)}</span>
        </p>
      </div>
      <div className={classes.patientNotes}>
        <p>{patient_notes}</p>
        {isPatient && <span onClick={() => setEditNotesModal(true)}>Edit</span>}
      </div>

      {doctor_notes && (
        <div className={classes.doctorNotes}>
          <p>{doctor_notes}</p>
        </div>
      )}

      <div>
        <div className={classes.actionButtons}>
          {!pastAppointment && (
            <button onClick={() => props.cancelAppointment(appointmentId)}>
              Cancel
            </button>
          )}
          {!isPatient && (
            <button onClick={() => setEditNotesModal(true)}>
              {isDoctorNote ? "Edit Note" : "Add Note"}
            </button>
          )}

          {!isPatient && <button onClick={acceptAppointment}>Accept</button>}
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
