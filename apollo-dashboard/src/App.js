import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./Components/Auth/PrivateRoute";
import AppNavbar from "./Components/Nav/AppNavbar";
import AppFooter from "./Components/Footer/AppFooter";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile";
import ConsultDashboard from "./Pages/Consults/ConsultDashboard";
import Consult from "./Pages/Consults/Consult";
import Loading from "./Components/Loading/Loading";
import Admin from "./Pages/Admin/Admin"
import AuthorizedRoute from "./Components/Nav/AuthorizedRoute";

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
                    <AuthorizedRoute path="/consults" component={Consults} authorizedRoles={["admin", "doctor", "patient"]}  />
                    <PrivateRoute path="/profile" component={Profile} />
                    <AuthorizedRoute path="/admin" component={Admin} authorizedRoles={["Admin"]}  />
                    <PrivateRoute path="/consults/:consultId" component={Consult} />
                </Switch>
            </Container>
            <AppFooter />
        </div>
    );
}

export default App;
