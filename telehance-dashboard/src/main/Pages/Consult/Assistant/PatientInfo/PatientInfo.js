import React from "react";
import classes from '../Assistant.module.css';

const PatientInfo = ({
  name,
  picture,
  purpose
}) => {

  return (
    <div className={classes.content}>
      <h4>Patient Info</h4>
      <div className={classes.patient}>
        <img src={picture} className="rounded-circle" />
        <h5>{name}</h5>
      </div>
      {purpose ? <div>
        <h5>Reason For Visit</h5>
        <div className={classes.itemContainer}>
          <div className={classes.item}>
            {purpose}
          </div>
        </div>
      </div> : null}
      <div>

      </div>
    </div>
  );
}

export default PatientInfo;