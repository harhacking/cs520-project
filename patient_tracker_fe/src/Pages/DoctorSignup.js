import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorSignup = () => {
    let passwordMatch = true;

  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    first_name:"",
    last_name:"",
    email:"",
    username:"",
    password:"",
    confirmPassword:"",
    specialization:""
  })
  
  function register(event) {
    event.preventDefault();
    const config = {
      method: "post",
      url: "http://127.0.0.1:8000/api/doctor/register/",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(signupData),
    };

    axios(config)
      .then((res) => {
        console.log(res);
        navigate("/home");
        // EDIT HERE ONCE ENDPOINTS ARE ESTABLISHED/ BACKEND RUNS LOCALLY
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function setFormData(event) {
    event.preventDefault()
    const {target: {name, value}} = event
    setSignupData({
      ...signupData,
      [name]: value
    })

  }

  return (
    <div className={classes.signupContainer}>
      <p>Doctor Signup</p>
      <form className={classes.signupForm}>

        <div className={classes.groupsOfTwo}>

          <div className={classes.firstname}>
            <label htmlFor="firstname">First Name</label>
            <input type="text" id="firstname" name="first_name" onChange={setFormData}/>
          </div>

          <div className={classes.lastname}>
            <label htmlFor="lastname">Last Name</label>
            <input type="text" id="lastname" name="last_name" onChange={setFormData}/>
          </div>

        </div>

        <div className={classes.groupsOfTwo}>

          <div className={classes.email}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email"  onChange={setFormData}/>
          </div>

          <div className={classes.specialization}>
            <label htmlFor="Specialization">Specialization</label>
            <input type="text" id="specialization" name='specialiaztion' onChange={setFormData}/>
          </div>

        </div>
        
        <div className={classes.groupsOfTwo}>

          <div className={classes.username}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" onChange={setFormData}/>
          </div>

            <div className={classes.password}>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={signupData.password}
                    onChange={setFormData}
                />
            </div>
          
          </div>

        <button type="submit" onClick={register}>
          Signup
        </button>
      </form>
      <p>
        Already a user? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default DoctorSignup;
