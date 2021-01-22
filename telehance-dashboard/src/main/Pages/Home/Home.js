import React from 'react';
import Loading from '@Components/Loading/Loading';
import classes from './Home.module.css';

export default function Home() {
  return (
    <div className={classes.hero}>
      <h1 className={classes['hero-title']}>
        Whole-Person
        <br></br>
        <b>Virtual Care for All</b>
        <br></br>
      </h1>
      <div className={classes['hero-text']}>
        <p>
          The technology to connect, expertise you can trust and the power to
          improve health
        </p>
      </div>
      <div className={classes['hero-img-container']}>
        <img
          src='//images.ctfassets.net/l3v9j0ltz3yi/4bXqK2gD3hJh254bJsfrvT/cafe3766afb0b42cc72157bf671e2d87/hero-img.jpg'
          alt='Whole-person virtual care for all'
        />
      </div>
    </div>
  );
}
