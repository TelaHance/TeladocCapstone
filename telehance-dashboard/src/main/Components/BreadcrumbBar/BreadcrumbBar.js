import React from "react";
import styles from "./BreadcrumbBar.module.css";

const BreadcrumbBar = (props) => {
  return (
    <div className={styles.bar}>
      <div className={styles.container}>
        <div className="row align-items-center">
          <div className="col-md-12 col-12">
            <nav aria-label="breadcrumb" className={styles.page}>
              <ol className="breadcrumb">
                <li className={styles.item}>
                  <a href="/">Home</a>
                </li>
                <li className={styles.item + " " +  styles.active} aria-current="page">
                  {props.page}
                </li>
              </ol>
            </nav>
            <h2 className={styles.title}>{props.page}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbBar