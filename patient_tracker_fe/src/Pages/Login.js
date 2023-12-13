// import Navbar from "../Components/Navbar";
import classes from "../Styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import patientHumanPng from "../assets/login/patient.png";
import videoCallPng from "../assets/login/videocall.png";

function Login() {
  const navigate = useNavigate();
  const form = useForm({ mode: "all" });
  const { register, control, handleSubmit, formState, clearErrors, watch } =
    form;
  const { errors, isDirty, isValid } = formState;

  const username = watch("username", "");
  const password = watch("password", "");
  const [credError, setCredError] = useState("");

  const loginHandler = (e) => {
    const data = {
      username: username,
      password: password,
    };

    axios
      .post("http://127.0.0.1:8000/auth/", JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.status === 200) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          const firstName = res.data.CustomUser.first_name;
          const lastName = res.data.CustomUser.last_name;
          const name = firstName + " " + lastName;
          localStorage.setItem("name", name);
          if (res.data.CustomUser.is_doctor) {
            localStorage.setItem("doctorId", res.data.Doctor.id);
            navigate("/doctor_home", {
              state: {
                isDoctor: true,
                username,
              },
            });
          } else {
            localStorage.setItem("patientId", res.data.Patient.id);
            navigate("/patient_home", {
              state: {
                isDoctor: false,
                patient_name: name,
                username,
              },
            });
          }
        }
      })
      .catch((error) => {
        setCredError(error.response.data);
      });
  };

  return (
    <div className={classes.loginContainer}>
      <h1 className={classes.underlineMagical}>Patient Tracker</h1>
      <p>Login</p>
      <img
        className={classes.patientHumanPng}
        src={patientHumanPng}
        alt="..."
      />
      <img className={classes.videoCallPng} src={videoCallPng} alt="..." />
      <form
        className={classes.loginForm}
        onSubmit={handleSubmit(loginHandler)}
        noValidate
      >
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            {...register("username", {
              required: "Username cannot be empty",
            })}
          />
          <p className={classes.errorMessage}>{errors.username?.message}</p>
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            {...register("password", {
              required: "Password cannot be empty",
            })}
          />
          <p className={classes.errorMessage}>{errors.password?.message}</p>
        </div>

        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/PreSignup">Sign up</Link>
      </p>
      {credError && <p className={classes.errorMessage}>{credError}</p>}
    </div>
  );
}

export default Login;
