import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [appointments, setAppointments] = useState();
    useEffect(()=> {
        const config = {
            method: "get",
            url: "http://127.0.0.1:8000/api/doctor/register/",
          };
          axios(config)
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
    })
    function logoutHandler() {

    }
    return (
        <div><h1>Welcome Home!</h1>
        <button onClick={logoutHandler}>Log out</button>
        </div>
    )
}

export default Home;