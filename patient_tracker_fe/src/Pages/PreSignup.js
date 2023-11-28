import React from 'react';
import {Link} from "react-router-dom";
import classes from "../Styles/Login.module.css"

function PreSignup() {
    return (
      <div className={classes.loginContainer} >
        <form >
          <p>New patient or doctor?</p>
            <div>
              <Link to="/PatientSignup">
                <button type="button">Patient</button> 
              </Link>
              <Link to="/DoctorSignup">
                <button type="button">Doctor</button>
              </Link>
            </div>
          </form>
          <p>
            Already a user? <Link to="/">Login</Link>
          </p>
      </div>
    );
}

export default PreSignup;