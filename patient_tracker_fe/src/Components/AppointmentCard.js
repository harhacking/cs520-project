import classes from "../Styles/AppointmentCard.module.css";

function AppointmentCard() {
  return (
    <div className={classes.aptCard}>
      <div className={classes.profile}>
        <p>
          <span>John</span> <span>Doe</span>
        </p>
      </div>

      <div className={classes.patientNotes}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ipsum
          faucibus vitae aliquet nec. Purus ut faucibus pulvinar elementum.
          Condimentum vitae sapien pellentesque habitant morbi tristique
          senectus et. Sagittis orci a scelerisque purus semper eget duis. Augue
          interdum velit euismod in pellentesque. Feugiat vivamus at augue eget
          arcu dictum varius duis at. Nam libero justo laoreet sit amet cursus.
          In hendrerit gravida rutrum quisque non tellus. Fringilla phasellus
          faucibus scelerisque eleifend donec pretium vulputate. Aliquet lectus
          proin nibh nisl condimentum id. Dolor sed viverra ipsum nunc aliquet
          bibendum enim facilisis gravida.
        </p>
      </div>
      <div className={classes.actionButtons}>
        <button>Cancel</button>
        <button>Accept</button>
      </div>
    </div>
  );
}

export default AppointmentCard;
