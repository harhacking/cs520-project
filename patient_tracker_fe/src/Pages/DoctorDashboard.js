import { useState, useEffect } from "react";
import axios from "axios";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const doctorId = 2;
    const startTime = 1701093600000;
    const endTime = 1801093600000;
    axios
      .get(`http://127.0.0.1:8000/api/appointment/${doctorId}/`, {
        params: {
          start_time: startTime,
          end_time: endTime,
        },
      })
      .then((res) => {
        console.log(res);
      });
  }, []);

  return (
    <div>
      <p>Doc Dash</p>
      {appointments.forEach((appointment) => {
        <p>hehe</p>;
      })}
    </div>
  );
}

export default DoctorDashboard;
