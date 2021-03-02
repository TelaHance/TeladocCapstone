import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  faCommentAlt,
  faSearch,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { LiveConsultData, SymptomData } from 'Models';
import Symptoms from './Symptoms/Symptoms';
import Conditions from './Conditions/Conditions';
import Notes from './Notes/Notes';
import Sidebar, { Tools } from './Sidebar';
import classes from './Assistant.module.css';
import { diagnoseUrl } from 'Api';
import { fetchWithToken } from 'Util/fetch';

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
    patient,
  } = consult;

  const [currentTool, setCurrentTool] = useState<string>();
  const [isExpanded, setIsExpanded] = useState(false);
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const [diagnoseResult, setDiagnoseResult] = useState();
  const [medicalTerms, setMedicalTerms] = useState(
    symptoms ? [...symptoms] : []
  );

  function changeTool(option: string) {
    setCurrentTool((oldTool) => (oldTool !== option ? option : undefined));
  }

  async function diagnose(medicalTerms: SymptomData[]) {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        symptoms: medicalTerms.map((term) => {
          return {
            id: term.id,
            choice_id: term.choice_id,
          };
        }),
        start_time: start_time,
        consult_id: consult_id,
        patient_id: patient.user_id,
      }),
    };
    try {
      const diagnosis = await fetchWithToken(diagnoseUrl, awsToken, options);
      setDiagnoseResult(diagnosis);
    } catch (e) {
      alert(`Submission failed! ${e.message}`);
    }
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
          medicalTerms={medicalTerms}
          medicalConditions={
            diagnoseResult ? diagnoseResult : medical_conditions
          }
          question={question}
          isLive={isLive}
          diagnose={diagnose}
          setMedicalTerms={setMedicalTerms}
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
