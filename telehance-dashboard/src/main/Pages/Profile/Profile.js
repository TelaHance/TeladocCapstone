import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Col,  Form,  Button, Jumbotron } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import useSWR from "swr";
import { fetchWithToken } from "../../Util/fetch";
import BreadcrumbBar from "../../Components/BreadcrumbBar/BreadcrumbBar";
import styles from "./Profile.module.css";

function renderInput(label, type, defaultValue, readOnly=false, handleChange=null) {
  return (
    <Form.Group as={Col} md="6" controlId={label.replace(/\s/g, '')} className={styles["form-group"]}>
      <Form.Label>{label}</Form.Label>
        <Form.Control
          readOnly={readOnly}
          className={styles['form-control']}
          required
          type={type}
          placeholder={label}
          defaultValue={defaultValue}
          onChange={handleChange}
        />
      <Form.Control.Feedback />
    </Form.Group>
  )
}

const Profile = () => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  const { given_name, family_name, email, sub} = user;
  const user_id = sub ? sub.split('|')[1] : 'NULL';
  const [picture, setPicture] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [values, setValues] = useState({
    phone: '', sex: '', age: ''
  });
  const [validated, setValidated] = useState(false);
  const { data, error, mutate: mutateUser } = useSWR(
    [
      `https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id?user_id=${user_id}`,
      awsToken,
    ],
    fetchWithToken, {onSuccess: function(data, key, config) {
      setValues({phone: data.phone, sex: data.sex, age: data.age})
    }}
  );
  if (error) {
    console.error(error);
    return (
      <Jumbotron>
        Error
      </Jumbotron>
    );
  }
  const set = name => {
    return ({ target: { value } }) => {
      setValues(oldValues => ({...oldValues, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (event.target.checkValidity()) {
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
              phone: values.phone,
              age: values.age,
              sex: values.sex,
            }),
          }
        );
      } catch (e) {
        alert(`Submission failed! ${e.message}`);
      }
    }
    setValidated(true);
  };

  const changeHandler = (event) => {
    setPicture(event.target.files[0]);
		setIsFilePicked(true);
  };


  return (
    <>
    <BreadcrumbBar page='Profile' />
    <div className={styles.card}>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Row>
          <div className={styles['change-avatar']}>
            <div className={styles['profile-img']}>
              <img src={isFilePicked ? URL.createObjectURL(picture) : data?.picture} alt="User" />
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
          {renderInput("First Name", "text", given_name,true)}
          {renderInput("Last Name", "text", family_name,true)}
        </Form.Row>
        <Form.Row>
          {renderInput("Email", "email", email,true)}
          {renderInput("Phone Number", "phone", values.phone, false, set('phone'))}
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="6" controlId={"Sex"} className={styles["form-group"]}>
            <Form.Label>Sex</Form.Label>
              <Form.Control
                className={styles['form-control']}
                required
                as='select'
                placeholder="Sex"
                defaultValue={values.sex}
                onChange={set('sex')}
              >
                <option></option>
                <option>Male</option>
                <option>Female</option>
              </Form.Control>
            <Form.Control.Feedback></Form.Control.Feedback>
          </Form.Group>
          {renderInput("Age", "text", values.age, false, set('age'))}
        </Form.Row>
        <Button type="submit" className={styles['change-photo-btn']}>Submit Changes</Button>
      </Form>
    </div>
    </>
  );
};

export default Profile;
