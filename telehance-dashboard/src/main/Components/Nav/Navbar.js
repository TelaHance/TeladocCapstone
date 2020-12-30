import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//icon

import { faHospital } from "@fortawesome/free-regular-svg-icons";
import logo from "../assets/images/logo.png";
import Dropdown from "react-bootstrap/Dropdown";

const Navbar = (props) => {
  const url = window.location.pathname.split("/").slice(0, -1).join("/");

  return (
    
    <header className="header">
      <nav className="navbar navbar-expand-lg header-nav">
        <div className="navbar-header">
          <a href="#0" id="mobile_btn">
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <Link to="/home" className="navbar-brand logo">
            <img src={logo} className="img-fluid" alt="Logo" />
          </Link>
        </div>
        <div className="main-menu-wrapper">
          <div className="menu-header">
            <Link to="/home" className="menu-logo">
              <img src={logo} className="img-fluid" alt="Logo" />
            </Link>
            <a href="#0" id="menu_close" className="menu-close">
              <i className="fas fa-times"></i>
            </a>
          </div>
          <ul className="main-nav">
            <li className={`has-submenu ${url === "/home" ? "active" : ""}`}>
              <NavLink to="/home" activeClassName="active">
                Home
              </NavLink>
            </li>
            <li className={`has-submenu ${url === "/doctor" ? "active" : ""}`}>
              <a href="#0">
                Doctors<i className="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul className="submenu">
                <li>
                  <Link to="/doctor/doctor-dashboard">Doctor Dashboard</Link>
                </li>
                <li>
                  <Link to="/doctor/appointments">Appointments</Link>
                </li>
                <li>
                  <Link to="/doctor/schedule-timing">Schedule Timing</Link>
                </li>
                <li>
                  <Link to="/doctor/my-patients">Patients List</Link>
                </li>
                <li>
                  <Link to="/doctor/patient-profile">Patients Profile</Link>
                </li>
                <li>
                  <Link to="/doctor/chat-doctor">Chat</Link>
                </li>
                <li>
                  <Link to="/doctor/invoice">Invoices</Link>
                </li>
                <li>
                  <Link to="/doctor/profile-setting">Profile Settings</Link>
                </li>
                <li>
                  <Link to="/doctor/review">Reviews</Link>
                </li>
                <li>
                  <Link to="/doctor/doctor-register">Doctor Register</Link>
                </li>
              </ul>
            </li>
            <li className={`has-submenu ${url === "/patient" ? "active" : ""}`}>
              <a href="#0">
                Patients <i className="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul className="submenu">
                <li className="has-submenu">
                  <a href="#0">Doctors</a>
                  <ul className="submenu">
                    <li>
                      <Link to="/patient/doctor-grid">Map Grid</Link>
                    </li>
                    <li>
                      <Link to="/patient/doctor-list">Map List</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/patient/search-doctor">Search Doctor</Link>
                </li>
                <li>
                  <Link to="/patient/doctor-profile">Doctor Profile</Link>
                </li>
                <li>
                  <Link to="/patient/booking">Booking</Link>
                </li>
                <li>
                  <Link to="/patient/checkout">Checkout</Link>
                </li>
                <li>
                  <Link to="/patient/booking-success">Booking Success</Link>
                </li>
                <li>
                  <Link to="/patient/dashboard">Patient Dashboard</Link>
                </li>
                <li>
                  <Link to="/patient/favourites">Favourites</Link>
                </li>
                <li>
                  <Link to="/patient/patient-chat">Chat</Link>
                </li>
                <li>
                  <Link to="/patient/profile">Profile Settings</Link>
                </li>
                <li>
                  <Link to="/patient/change-password">Change Password</Link>
                </li>
              </ul>
            </li>
            <li className={`has-submenu ${url === "/pages" ? "active" : ""}`}>
              <a href="#0">
                Pages<i className="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul className="submenu">
                <li>
                  <Link to="/pages/voice-call">Voice Call</Link>
                </li>
                <li>
                  <Link to="/pages/video-call">Video Call</Link>
                </li>

                <li>
                  <Link to="/pages/calendar">Calendar</Link>
                </li>
               
                <li className="has-submenu">
                  <a href="#0">Invoices</a>
                  <ul className="submenu">
                  
                    <li>
                      <Link to="/pages/invoice-view">Invoice View</Link>
                    </li>
                  </ul>
                </li>
      
                <li className="active">
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/forgot-password">Forgot Password</Link>
                </li>
              </ul>
            </li>
            <li className={`has-submenu ${url === "/blog" ? "active" : ""}`}>
              <a href="#0">
                Blog<i className="fa fa-angle-down" aria-hidden="true"></i>
              </a>
              <ul className="submenu">
                <li>
                  <Link to="/blog/blog-list">Blog List</Link>
                </li>
                <li>
                  <Link to="/blog/blog-grid">Blog Grid</Link>
                </li>
                <li>
                  <Link to="/blog/blog-details">Blog Details</Link>
                </li>
              </ul>
            </li>
            <li>
              <a href="/admin" target="_blank" to="/admin">Admin</a>
            </li>
            <li className="login-link">
              <Link to="/">Login / Signup</Link>
            </li>
          </ul>
        </div>
        <ul className="nav header-navbar-rht">
          <li className="nav-item contact-item">
            <div className="header-contact-img">
              <FontAwesomeIcon icon={faHospital} />
            </div>
            <div className="header-contact-detail">
              <p className="contact-header">Contact</p>
              <p className="contact-info-header"> +1 315 369 5943</p>
            </div>
          </li>

          {props.location.pathname === "/pages/voice-call" ||
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
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
