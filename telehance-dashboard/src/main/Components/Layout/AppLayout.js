import React from "react";
import "./AppLayout.module.css";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import AppFooter from "../Footer/AppFooter";
import Home from "../../Pages/Home/Home";
import Profile from "../../Pages/Profile/Profile";
import ConsultDashboard from "../../Pages/Consults/ConsultDashboard/ConsultDashboard";
import Consult from "../../Pages/Consults";
import Admin from "../../Pages/Admin/Admin"
import AuthorizedRoute from "../Nav/AuthorizedRoute";
import TwilioCall from "../../Pages/Patients/TwilioCall";
import Patient from "../../Pages/Patients/Patients";
import PrivateRoute from "../Auth/PrivateRoute";
import AppNavbar from "../Nav/AppNavbar";
import Navbar from "../Nav/Navbar";

function AppLayout() {
    return (
        <div>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <AuthorizedRoute exact path="/consults" component={ConsultDashboard} authorizedRoles={["admin", "doctor", "patient"]}  />
                <PrivateRoute path="/profile" component={Profile} />
                <AuthorizedRoute path="/admin" component={Admin} authorizedRoles={["admin"]}  />
                <AuthorizedRoute path="/TwilioCall/:patientId&:phoneNumber" component={TwilioCall} authorizedRoles={["doctor"]}/>
                <PrivateRoute path="/consults/:consultId" component={(props) => <Consult {...props}/>} />
                <AuthorizedRoute path="/patients" component={Patient} authorizedRoles={["doctor"]}/>
            </Switch>
        </div>
    )
}

export default AppLayout;