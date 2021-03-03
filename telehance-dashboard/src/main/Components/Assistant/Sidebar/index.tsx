import React from 'react';
import clsx from 'clsx';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import classes from './Sidebar.module.css';

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

export default function Sidebar({ currentTool, onClick, tools, isExpanded }: SidebarProps) {
  const options = Object.entries(tools);
  return (
    <div className={classes.sidebar}>
      {options.map(([id, { icon, label }]) => (
        <SidebarOption
          key={id}
          onClick={() => onClick(id)}
          active={currentTool === id && isExpanded}
          icon={icon}
        >
          {label}
        </SidebarOption>
      ))}
    </div>
  );
}

export type SidebarProps = {
  currentTool?: string;
  onClick: (id: string) => void;
  tools: Tools;
  isExpanded: boolean;
};

export type SidebarOptionProps = {
  active?: boolean;
  onClick: () => void;
  icon: FontAwesomeIconProps['icon'];
  children: string;
};

export type Tools = {
  [key: string]: {
    icon: FontAwesomeIconProps['icon'];
    label: string;
    component: (props: any) => React.ReactElement;
  };
};