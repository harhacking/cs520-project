import React, { useState } from "react";
import axios from "axios";
import classes from "../Styles/EditNotesModal.module.css";

function EditNotesModal(props) {
  const { appointmentId, patient_notes } = props;
  const [editNote, setEditNote] = useState(patient_notes);
  const token = localStorage.getItem("token");

  function updateNote() {
    console.log(editNote);
    const data = {
      patient_notes: editNote,
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
        props.setEditNotesModal(false);
        props.getAppointments();
      })
      .catch((e) => {
        props.setEditNotesModal(false);
      });
  }

  return (
    <div className={classes.editNotesModalContainer}>
      <div className={classes.editNotesModal}>
        <textarea
          placeholder="Edit..."
          value={editNote}
          onChange={(e) => setEditNote(e.target.value)}
        ></textarea>
        <div className={classes.modalButtons}>
          <button onClick={updateNote} disabled={editNote === patient_notes}>
            Save
          </button>
          <button onClick={() => props.setEditNotesModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditNotesModal;
