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
                <button onClick={() => alert('Button 1 clicked')}>Patient</button> 
              </Link>
              {/* <button onClick={() => alert('Button 1 clicked')}>Patient</button> */}
              <Link to="/DoctorSignup">
                <button onClick={() => alert('Button 2 clicked')}>Doctor</button>
              </Link>
              {/* <button onClick={() => alert('Button 2 clicked')}>Doctor</button> */}
            </div>
          </form>
          <p>
            Already a user? <Link to="/">Login</Link>
          </p>
      </div>
    );
}

export default PreSignup;
