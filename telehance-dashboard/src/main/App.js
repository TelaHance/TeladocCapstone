import React from 'react';
import { hot } from 'react-hot-loader/root';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Switch } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import ConsultDashboard from './Pages/ConsultDashboard';
import Consult from './Pages/ConsultDashboard/Consult';
import Spinner from '@Components/Spinner';
import Admin from './Pages/Admin/Admin';
import AuthorizedRoute from './Components/Auth/AuthorizedRoute';
import TwilioCall from './Pages/Patients/TwilioCall';
import Patient from './Pages/Patients/Patients';
import PrivateRoute from './Components/Auth/PrivateRoute';
import Layout from './Components/Layout';
import classes from './App.module.css';

function App() {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className={classes.loading}>
        <Spinner />
      </div>
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path='/' exact component={Home} />
        <AuthorizedRoute
          exact
          path='/consults'
          component={ConsultDashboard}
          authorizedRoles={['admin', 'doctor', 'patient']}
        />
        <PrivateRoute path='/profile' component={Profile} />
        <AuthorizedRoute
          path='/admin'
          component={Admin}
          authorizedRoles={['admin']}
        />
        <AuthorizedRoute
          path='/TwilioCall/:patientId&:phoneNumber'
          component={TwilioCall}
          authorizedRoles={['doctor']}
        />
        <PrivateRoute
          path='/consults/:consultId'
          component={(props) => <Consult {...props} />}
        />
        <AuthorizedRoute
          path='/patients'
          component={Patient}
          authorizedRoles={['doctor']}
        />
      </Switch>
    </Layout>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
