import React from 'react';
import classes from './Home.module.css';
import HeroHome from "Pages/Home/HeroHome/HeroHome";
import FeaturesBlocks from "Pages/Home/FeatureBlocks/FeatureBlock";
import Footer from "Pages/Home/Footer/Footer";

const Home = () => {
  return (
      <main className={classes["flex-container"]}>

          {/*  Page sections */}
          <HeroHome />
          <FeaturesBlocks/>
          <Footer/>
      </main>
  );
}
export default Home;
