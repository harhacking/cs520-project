import React from "react";
import classes from "../Styles/Toast.module.css";

function Toast(props) {
    console.log(props)
  return (
    <div className={classes.toastContainer}>
      <div>{props.children}</div>
    </div>
  );
}

export default Toast;
