import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Spinner from "../Spinner";

const PrivateRoute = ({ component, ...args }) => (
    <Route
        component={withAuthenticationRequired(component, {
            onRedirecting: () => <Spinner />,
        })}
        {...args}
    />
);

export default PrivateRoute;
