import React from 'react';
import clsx from 'clsx';
import SpinnerSVG from '@assets/spinner.svg';
import classes from './Spinner.module.css';

export default function Spinner(props: React.ComponentProps<'div'>) {
  return (
    <div className={clsx(props.className, classes.spinner)} {...props}>
      <img src={SpinnerSVG} alt="Loading"/>
    </div>
  );
}
