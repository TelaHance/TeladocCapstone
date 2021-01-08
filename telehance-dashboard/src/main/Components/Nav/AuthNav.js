import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { Navbar } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "./Navbar.module.css";

const AuthNav = (props) => {
    console.log(props)
    const { user, logout } = useAuth0();
    if(user) {
        const { name, picture } = user;
        return <>
            {/* <Navbar.Text style={{marginRight: 15}}>{"Hello, " + name}</Navbar.Text> */}
            <li>{"Hello, " + name}</li>
            <Dropdown className={styles['user-drop'] + ' ' + styles['nav-item'] + ' ' + styles['dropdown'] + ' ' + styles['has-arrow'] + ' ' + styles['logged-item']}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    className="rounded-circle"
                    src={picture}
                    width="31"
                    alt={name}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <div className={styles['user-header']}>
                    <div className={styles['avatar'] + ' ' + styles['avatar-sm']}>
                      <img
                        src={picture}
                        alt="User"
                        className="avatar-img rounded-circle"
                      />
                    </div>
                    <div className={styles['user-text']}>
                      <h6>{name}</h6>
                      <p className="text-muted mb-0">{props.role}</p>
                    </div>
                  </div>
                  <Dropdown.Item href="/doctor/doctor-dashboard">
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item href="/profile">
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => logout({ returnTo: window.location.origin })}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
        </>
    } else {
        return <LoginButton/>
    }
};

export default AuthNav;
