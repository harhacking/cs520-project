import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {
  function register(e) {
    let email = "doc@gmail.com";
    let password = "test";
    let first_name = "Lorem";
    let last_name = "Ipsum";
    let username = "testuser";
    let specialization = "General";

    let data = {
      "first_name": first_name,
      "last_name":last_name,
      "username":username,
      "password": password,
      "email": email,
      "specialization": specialization
    }

    e.preventDefault();
    const config = {
      method : "post",
      url : "http://127.0.0.1:8000/api/doctor/register/",
      headers : {
          "Content-Type":"application/json",  
      },
      data : JSON.stringify(data)
  }
    axios(config)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <div className={classes.signupContainer}>
      <p>Signup</p>
      <form className={classes.signupForm}>
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div className={classes.confirmPassword}>
          <label htmlFor="password">Confirm Password</label>
          <input type="password" id="confirmPassword" />
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

export default Signup;
