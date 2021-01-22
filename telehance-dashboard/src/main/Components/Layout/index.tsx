import React from 'react';
import Navbar from '../Nav/Navbar';
import classes from './Layout.module.css';

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={classes.container}>
      <Navbar />
      <div className={classes.content}>{children}</div>
    </div>
  );
}

type LayoutProps = {
  children: React.ReactChildren;
};
