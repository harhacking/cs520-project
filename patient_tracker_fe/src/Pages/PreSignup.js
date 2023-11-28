import React from "react";
import { Link } from "react-router-dom";
import classes from "../Styles/PreSignup.module.css";

function PreSignup() {
  return (
    <div className={classes.preSignupContainer}>
      <p className={classes.text}>New patient or doctor?</p>
      <div className={classes.signupLinksContainer}>
        <Link to="/PatientSignup">
          <button type="button" className={classes.newSignupBtn}>
            Patient
          </button>
        </Link>
        <Link to="/DoctorSignup">
          <button type="button" className={classes.newSignupBtn}>
            Doctor
          </button>
        </Link>
      </div>
      <p className={classes.text}>
        Already a user? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default PreSignup;
