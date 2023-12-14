import React from "react";
import { Link } from "react-router-dom";
import classes from "../Styles/PreSignup.module.css";
import plant from "../assets/presignup/plant.png"
import doctor from "../assets/presignup/doctor.png"
import man from "../assets/presignup/man.png"

//This Page offers two options - signup as a patient or a doctor
function PreSignup() {
  return (
    <div className={classes.preSignupContainer}>
      <h1 className={classes.underlineMagical}>Patient Tracker</h1>
      <img className={classes.plant} src={plant} alt="..."/>
      <img className={classes.doctor} src={doctor} alt="..."/>
      <img className={classes.man} src={man} alt="..."/>

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