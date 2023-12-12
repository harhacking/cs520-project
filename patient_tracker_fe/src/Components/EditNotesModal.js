import React, { useState } from "react";
import axios from "axios";
import classes from "../Styles/EditNotesModal.module.css";

function EditNotesModal(props) {
  const { appointmentId, patient_notes, doctor_notes, isPatient } = props;
  const [editNote, setEditNote] = useState(isPatient ? patient_notes : "");
  const token = localStorage.getItem("token");

  const notes = isPatient ? "patient_notes" : "doctor_notes";

  const isDisabled = (isPatient ? patient_notes : doctor_notes) === editNote

  function updateNote() {
    const data = {
      [notes]: editNote,
    };
    axios
      .put(
        `http://127.0.0.1:8000/api/appointment/update/${appointmentId}/note/`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        props.setToastMessage(res.data.message);
        props.setEditNotesModal(false);
        props.getAppointments();
      })
      .catch((e) => {
        console.log(e);
        props.setEditNotesModal(false);
      });
  }

  return (
    <div className={classes.editNotesModalContainer}>
      <div className={classes.editNotesModal}>
        <textarea
          placeholder={isPatient ? "Edit..." : "Add your note"}
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
        ></textarea>
        <div className={classes.modalButtons}>
          <button
            onClick={updateNote}
            disabled={isDisabled}
          >
            Save
          </button>
          <button onClick={() => props.setEditNotesModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditNotesModal;
