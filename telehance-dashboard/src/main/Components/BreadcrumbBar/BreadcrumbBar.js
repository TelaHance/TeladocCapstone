import React from "react";
import styles from "./BreadcrumbBar.module.css";


const BreadcrumbBar = (props) => {
  return (
    <div className={styles["breadcrumb-bar"]}>
      <div className={styles["container-fluid"]}>
        <div className="row align-items-center">
          <div className="col-md-12 col-12">
            <nav aria-label="breadcrumb" className={styles["page-breadcrumb"]}>
              <ol className="breadcrumb">
                <li className={styles["breadcrumb-item"]}>
                  <a href="/">Home</a>
                </li>
                <li className={styles["breadcrumb-item"] + " " +  styles["active"]} aria-current="page">
                  {props.page}
                </li>
              </ol>
            </nav>
            <h2 className={styles["breadcrumb-title"]}>{props.page}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbBar