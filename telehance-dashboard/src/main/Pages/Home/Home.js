import React from 'react';
import classes from './Home.module.css';
import HeroHome from "Pages/Home/HeroHome/HeroHome";
import FeaturesBlocks from "Pages/Home/FeatureBlocks/FeatureBlock";
import Footer from "Pages/Home/Footer/Footer";

const Home = () => {
  return (
      <div className={classes["bg-container"]}>
          <div className={classes["flex-container"]}>
              {/*  Page sections */}
              <HeroHome />
              <FeaturesBlocks/>
              <Footer/>
          </div>
      </div>
  );
}
export default Home;
