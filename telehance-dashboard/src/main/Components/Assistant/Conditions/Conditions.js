import React from "react";
import classes from '../Assistant.module.css';
import { ProgressBar } from 'react-bootstrap';

const Conditions = ({
  medicalConditions,
  question
}) => {

  return (
    <div className={classes.content}>
      <h4>Intelligent Diagnostic Assistant</h4>
      <h5>Suggested Question</h5>
      {question && <div style={{ "marginBottom": "1rem" }}>{question}</div>}
      {medicalConditions && <div className={classes.itemContainer}>
        {medicalConditions.map((condition) => (
          <div className={classes.item} key={condition.id}>
            <div>
              <ProgressBar
                now={Math.round(condition.probability * 100)}
                variant={Math.round(condition.probability * 100) > 66 ? "success" :
                  (Math.round(condition.probability * 100) > 33 ? "warning" : "danger")}
                className={classes.progressBar}
              />
              {Math.round(condition.probability * 100) + '%'}
            </div>
            <div>
              <div className={classes.name}>
                {condition.name}
              </div>
              <div className={classes.commonName}>
                {condition.common_name}
              </div>
            </div>
          </div>

        ))}
      </div>}
    </div>
  );
}

export default Conditions;