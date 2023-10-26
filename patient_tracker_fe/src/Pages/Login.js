// import Navbar from "../Components/Navbar";
import classes from "../Styles/Login.module.css";

function Login() {
  return (
    <div className={classes.loginContainer}>
      <p>Login</p>
      <form className={classes.loginForm}>
        <div className={classes.username}>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" />
        </div>
        <div className={classes.password}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/">Sign up</a></p>
    </div>
  );
}

export default Login;
