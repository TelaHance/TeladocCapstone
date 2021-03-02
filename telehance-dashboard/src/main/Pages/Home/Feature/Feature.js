import React from "react";
import classes from "./Feature.module.css";

export default function Feature(props) {
  return (
    <div className={classes.container}>
      <img
        src={props.src} //feature objects
        alt={props.alt}
      />
      <div className={classes.text}>
        <h6>{props.title}</h6>
        <p>{props.description}</p>
      </div>
    </div>
  );
}
