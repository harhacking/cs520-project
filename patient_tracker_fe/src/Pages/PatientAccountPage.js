import React, { useState, useEffect } from "react";
import axios from "axios";
import classes from "../Styles/PatientAccountPage.module.css";

function PatientAccountPage() {
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/patient/details/", {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
      });
  }, []);

  return <div>hehe</div>;
}

export default PatientAccountPage;
