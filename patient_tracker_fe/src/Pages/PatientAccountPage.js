import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import classes from "../Styles/PatientAccountPage.module.css";

function PatientAccountPage() {
  const [userData, setUserData] = useState({});

  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/patient/details/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log("response->");
        console.log(res);
        setUserData(res.data.Patient);
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
      });
  }, []);

  return (
      <div className={classes.accountPageContainer}>
        <Navbar />
        <div className={classes.detail}>
          <label>Height</label>
          <span>{userData.height}</span>
        </div>

        <div className={classes.detail}>
          <label>Weight</label>
          <span>{userData.weight}</span>
        </div>

        <div className={classes.detail}>
          <label>Blood Group</label>
          <span>{userData.blood_group}</span>
        </div>

        <div className={classes.detail}>
          <label>Diagnoses</label>
          <span>{userData.diagnoses}</span>
        </div>

        <div className={classes.detail}>
          <label>Medical History</label>
          <span>{userData.medical_history}</span>
        </div>

        <div className={classes.detail}>
          <label>Medications</label>
          <span>{userData.medications}</span>
        </div>
      </div>
  );
}

export default PatientAccountPage;
