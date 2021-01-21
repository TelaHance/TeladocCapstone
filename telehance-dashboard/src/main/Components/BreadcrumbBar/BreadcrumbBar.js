import React from "react";
import "./BreadcrumbBar.css";


const BreadcrumbBar = (props) => {
  return (
    <div className="breadcrumb-bar">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-12 col-12">
            <nav aria-label="breadcrumb" className="page-breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {props.page}
                </li>
              </ol>
            </nav>
            <h2 className="breadcrumb-title">{props.page}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbBar