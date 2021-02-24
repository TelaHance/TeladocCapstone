import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import {
  faCommentAlt,
  faSearch,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';
import { LiveConsultData } from 'Models';
import Symptoms from './Symptoms/Symptoms';
import Conditions from './Conditions/Conditions';
import Notes from './Notes/Notes';
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

const options = Object.entries(tools);

function SidebarOption({
  active,
  onClick,
  icon,
  children,
}: SidebarOptionProps) {
  return (
    <button
      onClick={onClick}
      className={clsx({
        [classes.active]: active,
      })}
    >
      <FontAwesomeIcon icon={icon} />
      <span>{children}</span>
    </button>
  );
}

function Sidebar({ currentTool, onClick }: SidebarProps) {
  return (
    <div className={classes.sidebar}>
      {options.map(([id, { icon, label }]) => (
        <SidebarOption
          key={id}
          onClick={() => onClick(id)}
          active={currentTool === id}
          icon={icon}
        >
          {label}
        </SidebarOption>
      ))}
    </div>
  );
}

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
          symptoms={symptoms}
          medicalConditions={medical_conditions}
          question={question}
          isLive={isLive}
        />
      </div>
      <Sidebar currentTool={currentTool} onClick={changeTool} />
    </>
  );
}

type AssistantProps = {
  consult: LiveConsultData;
  isLive?: boolean;
  action: (bool: boolean) => void;
};

type SidebarProps = {
  currentTool?: string;
  onClick: (id: string) => void;
};

type SidebarOptionProps = {
  active?: boolean;
  onClick: () => void;
  icon: FontAwesomeIconProps['icon'];
  children: string;
};

type Tools = {
  [key: string]: {
    icon: FontAwesomeIconProps['icon'];
    label: string;
    component: (props: any) => React.ReactElement;
  };
};
