import classes from "../Styles/Signup.module.css";

import { Link } from "react-router-dom";

function Signup() {
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
          <input type="password" id="password" />
        </div>
        <button type="submit">Signup</button>
      </form>
      <p>
        Already a user?{" "}
        <a href="/">
          <Link to="/">Login</Link>
        </a>
      </p>
    </div>
  );
}

export default Signup;
