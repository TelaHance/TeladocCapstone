import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import AppLayout from "./Components/Layout/AppLayout";
import Loading from "./Components/Loading/Loading";
import { Route, Switch } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import ConsultDashboard from "./Pages/Consults/ConsultDashboard/ConsultDashboard";
import Consult from "./Pages/Consults/Consult";
import Admin from "./Pages/Admin/Admin"
import AuthorizedRoute from "./Components/Auth/AuthorizedRoute";
import TwilioCall from "./Pages/Patients/TwilioCall";
import Patient from "./Pages/Patients/Patients";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import Navbar from "./Components/Nav/Navbar";

function App() {
    const {isLoading} = useAuth0();
    if (isLoading) {
        return <Loading />;
    }

    return (
        <AppLayout>
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
        </AppLayout>
    );
}

export default App;
