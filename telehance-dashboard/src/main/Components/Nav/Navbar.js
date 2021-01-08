import React from "react";
import { Link, NavLink } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//icon

// import { faHospital } from "@fortawesome/free-regular-svg-icons";
import logo from "../../assets/logo.png";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth0 } from "@auth0/auth0-react";
import useSWR from "swr";
import { fetchWithUser } from "../../Util/fetch";
import AuthNav from "./AuthNav";
import styles from "./Navbar.module.css";

const Navbar = (props) => {
  const awsToken = process.env.REACT_APP_MANAGEMENT_API_KEY;
  const { user } = useAuth0();
  const sub = user ? user.sub.split('|')[1] : "NULL";
  const { data: roleInfo} = useSWR(
      ["https://qf5ajjc2x6.execute-api.us-west-2.amazonaws.com/dev/user-by-id", awsToken, 'POST', sub],
      fetchWithUser);
  const isLoggedIn = (roleInfo?.body) ? JSON.parse(roleInfo.body).role.toLowerCase() : null;
  const isAdmin = (roleInfo?.body) ? "admin" === JSON.parse(roleInfo.body).role.toLowerCase() : null;
  const isDoctor = (roleInfo?.body) ? "doctor" === JSON.parse(roleInfo.body).role.toLowerCase() : null;

  return (
    
    <header className={styles.header}>
      <nav className={styles.navbar + ' ' + styles.headerNav}>
        <div className={styles.navbarHeader}>
          <a href="#0" id={styles.mobile_btn}>
            <span className={styles.barIcon}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <Link to="/" className={styles.navbarBrand + ' ' + styles.logo}>
            <img src={logo} className="img-fluid" alt="Logo" />
          </Link>
        </div>
        <div className={styles.mainMenuWrapper}>
          <div className={styles.menuHeader}>
            {/* <Link to="/" className={styles.menuLogo}>
              <img src={logo} className="img-fluid" alt="Logo" />
            </Link> */}
            <a href="#0" id="menu_close" className={styles.menuClose}>
              <i className={styles.fas + ' ' + styles.faTimes}></i>
            </a>
          </div>
          <ul className={styles.mainNav}>
            <li>
              <NavLink to="/" activeClassName={styles.active}>
                TelaHance Dashboard
              </NavLink>
            </li>
            {isLoggedIn && 
              <li>
                <NavLink to="/consults">
                  Consults
                </NavLink>
              </li>
            }
            {isAdmin &&
              <li>
                <NavLink to="/admin">
                  Admin
                </NavLink>
              </li>
            }
            {isDoctor && 
              <li>
                <NavLink to="/patients">
                  Patients
                </NavLink>
              </li>
            }
          </ul>
        </div>
        <ul className={styles['nav'] + ' ' + styles['header-navbar-rht']}>
          <AuthNav role={(roleInfo?.body) ? JSON.parse(roleInfo.body).role : null}/>
          {/* {props.location.pathname === "/pages/voice-call" ||
          "/pages/video-call" ? (
            <>
              <Dropdown className="user-drop nav-item dropdown has-arrow logged-item">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    className="rounded-circle"
                    src={IMG01}
                    width="31"
                    alt="Darren Elder"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <div className="user-header">
                    <div className="avatar avatar-sm">
                      <img
                        src={IMG01}
                        alt="User"
                        className="avatar-img rounded-circle"
                      />
                    </div>
                    <div className="user-text">
                      <h6>Darren Elder</h6>
                      <p className="text-muted mb-0">Doctor</p>
                    </div>
                  </div>
                  <Dropdown.Item href="/doctor/doctor-dashboard">
                    Dashboard
                  </Dropdown.Item>
                  <Dropdown.Item href="/doctor/profile-setting">
                    Profile Settings
                  </Dropdown.Item>
                  <Dropdown.Item href="/login">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link header-login">
                  login / Signup{" "}
                </Link>
              </li>{" "}
            </>
          )} */}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
