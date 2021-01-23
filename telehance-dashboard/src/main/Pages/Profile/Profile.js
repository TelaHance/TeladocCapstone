import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Container, Col, Badge } from "react-bootstrap";
import ReactJson from "react-json-view";
import useSWR from "swr";
import {fetchWithUser} from "../../Util/fetch";
import BreadcrumbBar from "../../Components/BreadcrumbBar/BreadcrumbBar";
import styles from "./Profile.module.css";
const Profile = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  const { name, picture, email, sub} = user;
  const { data: roleInfo} = useSWR(
    ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub.split('|')[1]],
    fetchWithUser);
  return (
    <div>
      <BreadcrumbBar page="Profile" />
      <div className={styles["card"]}>
        <div className={styles["card-body"]}>
          <form>
            <div className="row form-row">
              <div className="col-12 col-md-12">
                <div className={styles["form-group"]}>
                  <div className={styles["change-avatar"]}>
                    <div className={styles["profile-img"]}>
                      <img src={picture} alt="User" />
                    </div>
                    <div className="upload-img">
                      <div className={styles["change-photo-btn"]}>
                          <span><i className="fa fa-upload"></i> Upload Photo</span>
                          <input type="file" className={styles["upload"]} />
                      </div>
                      <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>First Name</label>
                  <input type="text" className={styles["form-control"]} defaultValue="Richard" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Last Name</label>
                  <input type="text" className={styles["form-control"]} defaultValue="Wilson" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Date of Birth</label>
                  <div className={styles["cal-icon"]}>
                    <input type="text" className={styles["form-control"] + " " + "datetimepicker"} defaultValue="24-07-1983" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"] + " " + styles["select-wrapper"]}>
                  <label>Blood Group</label>
                  <select className={styles["form-control"]}>
                    <option>A-</option>
                    <option>A+</option>
                    <option>B-</option>
                    <option>B+</option>
                    <option>AB-</option>
                    <option>AB+</option>
                    <option>O-</option>
                    <option>O+</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Age</label>
                  <input type="age" className={styles["form-control"]} defaultValue="37"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"] + " " + styles["select-wrapper"]}>
                  <label>Sex</label>
                  <select className={styles["form-control"] + " " + "select"}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Email ID</label>
                  <input type="email" className={styles["form-control"]} defaultValue="richard@example.com"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Mobile</label>
                  <input type="text" defaultValue="+1 202-555-0125" className={styles["form-control"]}/>
                </div>
              </div>
              <div className="col-12">
                <div className={styles["form-group"]}>
                <label>Address</label>
                  <input type="text" className={styles["form-control"]} defaultValue="806 Twin Willow Lane"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>City</label>
                  <input type="text" className={styles["form-control"]} defaultValue="Old Forge"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>State</label>
                  <input type="text" className={styles["form-control"]} defaultValue="Newyork"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Zip Code</label>
                  <input type="text" className={styles["form-control"]} defaultValue="13420"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className={styles["form-group"]}>
                  <label>Country</label>
                  <input type="text" className={styles["form-control"]} defaultValue="United States"/>
                </div>
              </div>
            </div>
            <div className="submit-section">
                <button type="submit" className="btn btn-primary submit-btn">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
