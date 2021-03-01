import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  faCommentAlt,
  faSearch,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { LiveConsultData } from 'Models';
import Symptoms from './Symptoms/Symptoms';
import Conditions from './Conditions/Conditions';
import Notes from './Notes/Notes';
import Sidebar, { Tools } from './Sidebar';
import classes from './Assistant.module.css';

const tools = {
  symptom: {
    icon: faSearch,
    label: 'Symptoms',
    component: Symptoms,
  },
  conditions: {
    icon: faStethoscope,
    label: 'Diagnoses',
    component: Conditions,
  },
  notes: {
    icon: faCommentAlt,
    label: 'Notes',
    component: Notes,
  },
} as Tools;

export default function Assistant({ consult, isLive, action }: AssistantProps) {
  const {
    consult_id,
    start_time,
    symptoms,
    medical_conditions,
    question,
  } = consult;

  const [currentTool, setCurrentTool] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);

  function changeTool(option: string) {
    setCurrentTool((oldTool) => (oldTool !== option ? option : undefined));
  }

  useEffect(() => {
    setIsExpanded(!!currentTool);
    action(!!currentTool);
  }, [currentTool]);

  const Tool = currentTool
    ? tools[currentTool].component
    : () => {
        return <></>;
      };

  return (
    <>
      <div
        className={clsx(classes.infermedica, {
          [classes.infermedicaActive]: isExpanded,
        })}
      >
        <Tool
          consultId={consult_id}
          startTime={start_time}
          medicalTerms={symptoms}
          medicalConditions={medical_conditions}
          question={question}
          isLive={isLive}
        />
      </div>
      <Sidebar currentTool={currentTool} onClick={changeTool} tools={tools} />
    </>
  );
}

type AssistantProps = {
  consult: LiveConsultData;
  isLive?: boolean;
  action: (bool: boolean) => void;
};
