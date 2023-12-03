import { useState } from "react";
import classes from "../Styles/AppointmentCard.module.css";
import EditNotesModal from "./EditNotesModal";

function AppointmentCard(props) {
  const {
    doctor_name,
    patient_notes,
    doctor_notes,
    isPatient,
    appointmentId,
    appointmentTime,
  } = props;
  const [editNotesModal, setEditNotesModal] = useState(false);

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

  return (
    <div className={classes.aptCard}>
      {editNotesModal && (
        <EditNotesModal
          setEditNotesModal={setEditNotesModal}
          appointmentId={appointmentId}
          patient_notes={patient_notes}
          getAppointments={props.getAppointments}
        />
      )}
      <div className={classes.profile}>
        <p>
          <span>Dr. {doctor_name}</span>
          <span>{parseDate(appointmentTime)}</span>
        </p>
      </div>
      <div className={classes.notes}>
        <p>{patient_notes}</p>
        {isPatient && <span onClick={() => setEditNotesModal(true)}>Edit</span>}
      </div>

      {doctor_notes && <div className={classes.notes}>{doctor_notes}</div>}

      <div>
        <div className={classes.actionButtons}>
          <button onClick={() => props.cancelAppointment(appointmentId)}>
            Cancel
          </button>
          {!isPatient && <button>Accept</button>}
        </div>
      </div>
    </div>
  );
}

export default AppointmentCard;
