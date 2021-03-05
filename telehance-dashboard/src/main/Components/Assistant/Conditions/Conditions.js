import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import clsx from 'clsx';
import AnimatedList from '../AnimatedList';
import classes from '../Assistant.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync } from '@fortawesome/free-solid-svg-icons';

function Condition(item) {
  return (
    <div className={classes.item}>
      <div>
        <ProgressBar
          now={Math.round(item.probability * 100)}
          variant={
            Math.round(item.probability * 100) < 33
              ? 'success'
              : Math.round(item.probability * 100) < 66
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

const Conditions = ({ medicalConditions, question, diagnose, isLoading }) => {
  return (
    <div className={classes.content}>
      <h4>Intelligent Diagnostic Assistant</h4>
      <div className={classes.header}>
        <div>
          <h5>Suggested Question</h5>
          {question && <div style={{ marginBottom: '1rem' }}>{question}</div>}
        </div>
        <button title='Refresh' onClick={() => diagnose()}>
          <FontAwesomeIcon
            icon={faSync}
            size='lg'
          />
        </button>
      </div>

      {medicalConditions && (
        <div className={clsx(classes.itemContainer, {
          [classes.loading]: isLoading,
        })}>
          <AnimatedList items={medicalConditions} component={Condition} />
        </div>
      )}
    </div>
  );
};

export default Conditions;
