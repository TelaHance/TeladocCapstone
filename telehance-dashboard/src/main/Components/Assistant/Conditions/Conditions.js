import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import AnimatedList from '../AnimatedList';
import classes from '../Assistant.module.css';

function Condition(item) {
  return (
    <div className={classes.item}>
      <div>
        <ProgressBar
          now={Math.round(item.probability * 100)}
          variant={
            Math.round(item.probability * 100) > 66
              ? 'success'
              : Math.round(item.probability * 100) > 33
              ? 'warning'
              : 'danger'
          }
          className={classes.progressBar}
        />
        {Math.round(item.probability * 100) + '%'}
      </div>
      <div>
        <div className={classes.name}>{item.name}</div>
        <div className={classes.commonName}>{item.common_name}</div>
      </div>
    </div>
  );
}

const Conditions = ({ medicalConditions, question }) => {
  return (
    <div className={classes.content}>
      <h4>Intelligent Diagnostic Assistant</h4>
      <h5>Suggested Question</h5>
      {question && <div style={{ marginBottom: '1rem' }}>{question}</div>}
      {medicalConditions && (
        <div className={classes.itemContainer}>
          <AnimatedList items={medicalConditions} component={Condition} />
        </div>
      )}
    </div>
  );
};

export default Conditions;
