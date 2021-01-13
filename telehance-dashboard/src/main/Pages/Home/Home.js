import React from "react";
import { Jumbotron } from "react-bootstrap";
import styles from "./Home.module.css";
const Home = () => {
    return (
        <div className={styles['main-hero-section']}>
            <div className={styles['container-fluid']}>
                <div className={styles['row']}>
                    <div className={styles['col-12']}>
                        <h1 className={styles['title']}>
                            Whole-Person
                            <br></br>
                            <b>Virtual Care for All</b>
                            <br></br>
                        </h1>
                        <div className={styles['text']}>
                            <p>
                                The technology to connect, expertise you can trust and the power to improve health
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles['bg-img-wrap']}>
                <picture>
                    <img src="//images.ctfassets.net/l3v9j0ltz3yi/4bXqK2gD3hJh254bJsfrvT/cafe3766afb0b42cc72157bf671e2d87/hero-img.jpg"
                    alt="Whole-person virtual care for all" />
                </picture>
            </div>
        </div>
    );
};

export default Home;
