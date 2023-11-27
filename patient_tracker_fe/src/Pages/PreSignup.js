import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import classes from "../Styles/Login.module.css"

function PreSignup() {
    return (
      <div 
        className={classes.loginContainer}
      >
        <form
          // className={classes.loginForm}
        >
          <p>New patient or doctor?</p>
            <div>
              <Link to="/signup">
                <button>Patient</button> 
              </Link>
              <Link to="/DoctorSignup">
                <button>Doctor</button>
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
