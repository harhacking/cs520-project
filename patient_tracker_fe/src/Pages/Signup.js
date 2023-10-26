import classes from "../Styles/Signup.module.css";
import axios from "axios";
import { Link } from "react-router-dom";

function Signup() {

  function register(e) {
    e.preventDefault();
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.post("http://127.0.0.1:8000/api/doctor/register/", {
      first_name:"Lorem",
      last_name:"Ipsum",
      username:"testuser",
      password:"admin",
      email:"doc@gmail.com",
      specialization:"General"
    })
    .then(res => {
      console.log(res)
    })
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
        <button type="submit" onClick={register}>Signup</button>
      </form>
      <p>
        Already a user?{" "}
          <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
