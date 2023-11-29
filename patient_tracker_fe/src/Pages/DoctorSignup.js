import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function DoctorSignup() {
  const form = useForm({ mode: "all" });
  const { register, handleSubmit, formState, watch, getValues } = form;
  const { errors } = formState;

  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    usernameError: "",
  });

  const {
    firstname,
    lastname,
    username,
    password,
    email,
    confirmPassword,
    specialization,
  } = watch([
    "firstname",
    "lastname",
    "username",
    "password",
    "email",
    "confirmPassword",
    "specialization",
  ]);

  function passwordMatch() {
    if (
      getValues("confirmPassword") &&
      getValues("confirmPassword") !== getValues("password")
    ) {
      return <p className={classes.errorMessage}>Passwords do not match</p>;
    }
    return null;
  }

  function signup(event) {
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
      <p>Signup</p>
      <form
        className={classes.signupForm}
        onSubmit={handleSubmit(signup)}
        noValidate
      >
        <div className={classes.groupsOfTwo}>
          <div className={classes.firstname}>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              {...register("firstname", {
                required: "First name cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>{errors.firstname?.message}</p>
          </div>
          <div className={classes.lastname}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              {...register("lastname", {
                required: "Last name cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>{errors.lastname?.message}</p>
          </div>
        </div>
        <div className={classes.groupsOfTwo}>
          <div className={classes.email}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              {...register("email", {
                pattern: {
                  value:
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email format",
                },
                required: "Email cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>{errors.email?.message}</p>
          </div>
          <div className={classes.username}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              {...register("username", {
                required: "Username cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>
              {errors.username?.message || formErrors.usernameError}
            </p>
          </div>
        </div>

        <div className={classes.groupsOfTwo}>
          <div className={classes.password}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", {
                required: "Password cannot be empty",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message:
                    "Must contain at least 1 upper and lowercase letter, one digit, and 1 special character",
                },
              })}
            />
            <p className={classes.errorMessage}>{errors.password?.message}</p>
          </div>
          <div className={classes.confirmPassword}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              {...register("confirmPassword", {
                required: "Password cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>
              {errors.confirmPassword?.message}
            </p>
            {passwordMatch()}
          </div>
        </div>
        <div>
          <div className={classes.specialization}>
            <label htmlFor="specialization">Specialization</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              {...register("specialization", {
                required: "Specialization cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>
              {errors.specialization?.message}
            </p>
          </div>
        </div>

        <button type="submit">Signup</button>

      </form>
      <p>
        Already a user? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default DoctorSignup;
