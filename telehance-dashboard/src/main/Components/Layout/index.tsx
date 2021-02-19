import React from 'react';
import { Application } from 'react-rainbow-components';
import Navbar from 'Components/Nav/Navbar';
import classes from './Layout.module.css';

// Default, but we can edit these later to provide colors to the application.
const theme = {
  rainbow: {
    palette: {
      brand: '#01B6F5',
      success: '#1DE9B6',
      error: '#FE4849',
      warning: '#FC0',
      mainBackground: '#FFF',
    },
  },
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Application theme={theme} className={classes.container}>
      <Navbar />
      <div className={classes.content}>{children}</div>
    </Application>
  );
}

type LayoutProps = {
  children: React.ReactChildren;
};
