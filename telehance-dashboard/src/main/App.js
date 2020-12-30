import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import AppFooter from "./Components/Footer/AppFooter";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import ConsultDashboard from "./Pages/Consults/ConsultDashboard/ConsultDashboard";
import Consult from "./Pages/Consults/Consult";
import Loading from "./Components/Loading/Loading";
import Admin from "./Pages/Admin/Admin"
import AuthorizedRoute from "./Components/Nav/AuthorizedRoute";
import TwilioCall from "./Pages/Patients/TwilioCall";
import Patient from "./Pages/Patients/Patients";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import AppNavbar from "./Components/Nav/AppNavbar";

function App() {
    const {isLoading} = useAuth0();
    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="App">
            <AppNavbar />
            <Container className="flex-grow-1 mt-5">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <AuthorizedRoute exact path="/consults" component={ConsultDashboard} authorizedRoles={["admin", "doctor", "patient"]}  />
                    <AuthorizedRoute path="/admin" component={Admin} authorizedRoles={["admin"]}  />
                    <AuthorizedRoute path="/TwilioCall/:patientId&:phoneNumber" component={TwilioCall} authorizedRoles={["doctor"]}/>
                    <PrivateRoute path="/consults/:consultId" component={(props) => <Consult {...props}/>} />
                    <AuthorizedRoute path="/patients" component={Patient} authorizedRoles={["doctor"]}/>
                </Switch>
            </Container>
            <AppFooter />
        </div>
    );
}

export default App;
