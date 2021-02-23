import React, { useState } from 'react';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faArrowRight,
  faCommentAlt,
  faSearch,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { LiveConsultData } from 'Models';
import Symptoms from './Symptoms/Symptoms';
import Conditions from './Conditions/Conditions';
import Notes from './Notes/Notes';
import classes from './Assistant.module.css';

export default function Assistant({ consult, isLive, action }: AssistantProps) {
  const [active, setActive] = useState<string>();
  const [expandedSide, setExpandedSide] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  function toggleExpanded() {
    if (expandedSide || expandedContent) {
      setExpandedSide(false);
      setExpandedContent(false);
      action(false);
    } else {
      setExpandedSide(true);
    }
  }

  function renderSidebar() {
    return (
      <div className={classes.sidebar}>
        <button
          onClick={() => {
            setActive('symptoms');
            setExpandedSide(false);
            setExpandedContent(true);
            action(true);
          }}
          className={clsx({
            [classes.active]: expandedContent && active === 'symptoms',
          })}
        >
          <FontAwesomeIcon icon={faSearch} />
          {expandedSide && <div>Symptoms</div>}
        </button>
        <button
          onClick={() => {
            setActive('conditions');
            setExpandedSide(false);
            setExpandedContent(true);
            action(true);
          }}
          className={clsx({
            [classes.active]: expandedContent && active === 'conditions',
          })}
        >
          <FontAwesomeIcon icon={faStethoscope} />
          {expandedSide && <div>Diagnoses</div>}
        </button>
        <button
          onClick={() => {
            setActive('notes');
            setExpandedSide(false);
            setExpandedContent(true);
            action(true);
          }}
          className={clsx({
            [classes.active]: expandedContent && active === 'notes',
          })}
        >
          <FontAwesomeIcon icon={faCommentAlt} />
          {expandedSide && <div>Doctor's Notes</div>}
        </button>
        <button
          onClick={() => toggleExpanded()}
          style={{ marginTop: 'auto', width: '1.5em' }}
        >
          <FontAwesomeIcon
            icon={expandedSide || expandedContent ? faArrowRight : faArrowLeft}
          />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          expandedContent
            ? classes.infermedica + ' ' + classes.infermedicaActive
            : classes.infermedica
        }
      >
        {active === 'notes' ? <Notes /> : null}
        {active === 'conditions' ? (
          <Conditions
            medicalConditions={consult.medical_conditions}
            question={consult.question}
          />
        ) : null}
        {active === 'symptoms' ? (
          <Symptoms
            symptoms={consult.symptoms}
            consultId={consult.consult_id}
            startTime={consult.start_time}
            isLive={isLive}
          />
        ) : null}
      </div>
      {renderSidebar()}
    </>
  );
}

type AssistantProps = {
  consult: LiveConsultData;
  isLive?: boolean;
  action: (bool: boolean) => void;
};
