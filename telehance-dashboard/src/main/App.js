import React from 'react';
import { hot } from 'react-hot-loader/root';
import { useAuth0 } from '@auth0/auth0-react';
import { Route, Switch } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Profile from './Pages/Profile/Profile';
import Appointment from 'Pages/Appointment';
import AppointmentDashboard from 'Pages/AppointmentDashboard';
import ConsultDashboard from './Pages/ConsultDashboard';
import Consult from './Pages/Consult';
import Spinner from 'Components/Spinner';
import Admin from './Pages/Admin/Admin';
import AuthorizedRoute from './Components/Auth/AuthorizedRoute';
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
        <PrivateRoute
          path='/consults/:consultId'
          component={(props) => <Consult {...props} />}
        />
        <AuthorizedRoute
          exact
          path='/appointments'
          component={AppointmentDashboard}
          authorizedRoles={['patient', 'doctor']}
        />
        <AuthorizedRoute
          path='/appointment/:consultId'
          component={Appointment}
          authorizedRoles={['doctor']}
        />
      </Switch>
    </Layout>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(App) : App;
