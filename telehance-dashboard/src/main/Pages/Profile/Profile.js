import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Container, Col, Badge } from "react-bootstrap";
import ReactJson from "react-json-view";
import useSWR from "swr";
import {fetchWithUser} from "../../Util/fetch";
import BreadcrumbBar from "../../Components/BreadcrumbBar/BreadcrumbBar";
import "./Profile.css";
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
      <div className="card">
        <div className="card-body">
          <form>
            <div className="row form-row">
              <div className="col-12 col-md-12">
                <div className="form-group">
                  <div className="change-avatar">
                    <div className="profile-img">
                      <img src={picture} alt="User" />
                    </div>
                    <div className="upload-img">
                      <div className="change-photo-btn">
                          <span><i className="fa fa-upload"></i> Upload Photo</span>
                          <input type="file" className="upload" />
                      </div>
                      <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-control" value="Richard" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-control" value="Wilson" />
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <div className="cal-icon">
                    <input type="text" className="form-control datetimepicker" value="24-07-1983" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Blood Group</label>
                  <select className="form-control select">
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
                <div className="form-group">
                  <label>Age</label>
                  <input type="age" className="form-control" value="37"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Sex</label>
                  <select className="form-control select">
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Email ID</label>
                  <input type="email" className="form-control" value="richard@example.com"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Mobile</label>
                  <input type="text" value="+1 202-555-0125" className="form-control"/>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group">
                <label>Address</label>
                  <input type="text" className="form-control" value="806 Twin Willow Lane"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" className="form-control" value="Old Forge"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>State</label>
                  <input type="text" className="form-control" value="Newyork"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Zip Code</label>
                  <input type="text" className="form-control" value="13420"/>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" className="form-control" value="United States"/>
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
