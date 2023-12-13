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

  const [credError, setCredError ] = useState("");

  const first_name = watch("first_name");
  const last_name = watch("last_name");
  const username = watch("username");
  const password = watch("password");
  const email = watch("email");
  const specialization = watch("specialization");
  const confirmPassword = watch("confirmPassword");

  function passwordMatch() {
    if (
      getValues("confirmPassword") &&
      getValues("confirmPassword") !== getValues("password")
    ) {
      return <p className={classes.errorMessage}>Passwords do not match</p>;
    }
    return <p></p>;
  }

  function signup(event) {
    const data = {
      first_name: first_name,
      last_name: last_name,
      username: username,
      password: password,
      email: email,
      specialization: specialization,
    };
    const config = {
      method: "post",
      url: "http://127.0.0.1:8000/api/doctor/register/",
      headers: {
        "Content-Type": "application/json",
      },

      data: JSON.stringify(data),
    };

    axios(config)
      .then((res) => {
        navigate("/doctor_home");
      })
      .catch((e) => {
        setCredError(e.response.data.error);
      });
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
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              {...register("first_name", {
                required: "First name cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>{errors.first_name?.message}</p>
          </div>
          <div className={classes.last_name}>
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              {...register("last_name", {
                required: "Last name cannot be empty",
              })}
            />
            <p className={classes.errorMessage}>{errors.last_name?.message}</p>
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
      {credError && <p className={classes.errorMessage}>{credError}</p>}
    </div>
  );
}

export default DoctorSignup;
