import React from "react";
import classes from '../../../Components/Assistant/Assistant.module.css';

const PatientInfo = ({
  name,
  picture,
  purpose
}) => {

  return (
    <div>
      <div className={classes.patient}>
        <img src={picture} className="rounded-circle" width={70} />
        <h6>{name}</h6>
        {purpose ? <div>
          <h7>Reason For Visit</h7>
          <div className={classes.itemContainer}>
            <div className={classes.item}>
              {purpose}
            </div>
          </div>
        </div> : null}
      </div>

      <div>

      </div>
    </div>
  );
}

export default PatientInfo;