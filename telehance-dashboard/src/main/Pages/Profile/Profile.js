import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Row, Container, Col, Badge, Form, InputGroup, Button, Jumbotron } from "react-bootstrap";
import ReactJson from "react-json-view";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import useSWR from "swr";
import {fetchWithToken, fetchWithUser} from "../../Util/fetch";
import BreadcrumbBar from "../../Components/BreadcrumbBar/BreadcrumbBar";
import styles from "./Profile.module.css";
import { render } from "react-dom";

// function renderInput(label, type, defaultValue) {
//   return (
//     <div className="col-12 col-md-6">
//       <div className={styles["form-group"]}>
//         <label>{label}</label>
//         <input type={type} className={styles["form-control"]} defaultValue={defaultValue} />
//       </div>
//     </div>
//   )
// }

function renderInput(label, type, defaultValue, handleChange=null) {
  return (
    <Form.Group as={Col} md="6" controlId={label.replace(/\s/g, '')} className={styles["form-group"]}>
      <Form.Label>{label}</Form.Label>
        <Form.Control
          className={styles['form-control']}
          required
          type={type}
          placeholder={label}
          defaultValue={defaultValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
    </Form.Group>
  )
}

const Profile = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  console.log(user);
  const { given_name, family_name, email, sub} = user;
  const user_id = sub ? sub.split('|')[1] : 'NULL';
  const [picture, setPicture] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [phone, setPhone] = useState();
  const [validated, setValidated] = useState(false);
  const { data, error, mutate: mutateUser } = useSWR(
    [
      `https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id?user_id=${user_id}`,
      awsToken,
    ],
    fetchWithToken
  );
  if (error) {
    console.error(error);
    return (
      <Jumbotron>
        Error
      </Jumbotron>
    );
  }
  const userData = data ? JSON.parse(data.body) : null;
  console.log(userData);
  

  const handleSubmit = async (event) => {
    // const form = event.currentTarget;
    event.preventDefault();
    // console.log(form)
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
    try {
      await fetchWithToken(
        'https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/update-phone',
        awsToken,
        {
          method: 'PATCH',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user_id,
            phone: phone,
          }),
        }
      );
    } catch (e) {
      console.log(e);
    }

    setValidated(true);
    console.log(phone);
  };

  const changeHandler = (event) => {
    setPicture(event.target.files[0]);
    console.log(event.target.files[0]);
		setIsFilePicked(true);
  };


  return (
    <div className={styles.card}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Row>
          <div className={styles['change-avatar']}>
            <div className={styles['profile-img']}>
              <img src={isFilePicked ? URL.createObjectURL(picture) : userData?.picture} alt="User" />
            </div>
            <div>
              <Button className={styles["change-photo-btn"]}>
                Upload Photo
                <FontAwesomeIcon icon={faUpload} style={{"marginLeft": "5px"}} />
                <input type="file" className={styles["upload"]} onChange={changeHandler} />
              </Button>
              <small className="form-text text-muted">Allowed JPG or PNG. Max size of 2MB</small>
            </div>
          </div>
        </Form.Row>
        <Form.Row>
          {renderInput("First Name", "text", given_name)}
          {renderInput("Last Name", "text", family_name)}
        </Form.Row>
        <Form.Row>
          {renderInput("Email", "text", email)}
          {renderInput("Phone Number", "text", phone ? phone : userData?.phone, setPhone)}
        </Form.Row>
        <Button type="submit" className={styles['change-photo-btn']}>Submit Changes</Button>
      </Form>
    </div>
  );
  // return (
  //   <div>
  //     <BreadcrumbBar page="Profile" />
  //     <div className={styles["card"]}>
  //       <div className={styles["card-body"]}>
  //         <form>
  //           <div className="row form-row">
  //             <div className="col-12 col-md-12">
  //               <div className={styles["form-group"]}>
  //                 <div className={styles["change-avatar"]}>
  //                   <div className={styles["profile-img"]}>
  //                     <img src={picture} alt="User" />
  //                   </div>
  //                   <div className="upload-img">
  //                     <div className={styles["change-photo-btn"]}>
  //                         <span><i className="fa fa-upload"></i> Upload Photo</span>
  //                         <input type="file" className={styles["upload"]} />
  //                     </div>
  //                     <small className="form-text text-muted">Allowed JPG, GIF or PNG. Max size of 2MB</small>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //             {renderInput("First Name", "text", "Richard")}
  //             {renderInput("Last Name", "text", "Wilson")}
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Date of Birth</label>
  //                 <div className={styles["cal-icon"]}>
  //                   <input type="text" className={styles["form-control"]} defaultValue="24-07-1983" />
  //                   <FontAwesomeIcon icon={faCalendarAlt} size="lg"/>
  //                 </div>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"] + " " + styles["select-wrapper"]}>
  //                 <label>Blood Group</label>
  //                 <select className={styles["form-control"]}>
  //                   <option>A-</option>
  //                   <option>A+</option>
  //                   <option>B-</option>
  //                   <option>B+</option>
  //                   <option>AB-</option>
  //                   <option>AB+</option>
  //                   <option>O-</option>
  //                   <option>O+</option>
  //                 </select>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Age</label>
  //                 <input type="age" className={styles["form-control"]} defaultValue="37"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"] + " " + styles["select-wrapper"]}>
  //                 <label>Sex</label>
  //                 <select className={styles["form-control"] + " " + "select"}>
  //                   <option>Male</option>
  //                   <option>Female</option>
  //                 </select>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Email ID</label>
  //                 <input type="email" className={styles["form-control"]} defaultValue="richard@example.com"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Mobile</label>
  //                 <input type="text" defaultValue="+1 202-555-0125" className={styles["form-control"]}/>
  //               </div>
  //             </div>
  //             <div className="col-12">
  //               <div className={styles["form-group"]}>
  //               <label>Address</label>
  //               <input type="text" className={styles["form-control"]} defaultValue="806 Twin Willow Lane"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>City</label>
  //                 <input type="text" className={styles["form-control"]} defaultValue="Old Forge"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>State</label>
  //                 <input type="text" className={styles["form-control"]} defaultValue="Newyork"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Zip Code</label>
  //                 <input type="text" className={styles["form-control"]} defaultValue="13420"/>
  //               </div>
  //             </div>
  //             <div className="col-12 col-md-6">
  //               <div className={styles["form-group"]}>
  //                 <label>Country</label>
  //                 <input type="text" className={styles["form-control"]} defaultValue="United States"/>
  //               </div>
  //             </div>
  //           </div>
  //           <div className="submit-section">
  //               <button type="submit" className="btn btn-primary submit-btn">Save Changes</button>
  //           </div>
  //         </form>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Profile;
