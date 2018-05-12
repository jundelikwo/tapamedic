import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { stat } from 'fs';

const PublicRoute = ({
  isAuthenticated,
  name,
  role,
  emailVerified,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
        if(isAuthenticated){
          if(name){
            return <Redirect to="/dashboard" />
          }else if(role === 'doctor' && !emailVerified){
            return <Redirect to="/dashboard/verifyEmail" />
          }else{
            return <Redirect to="/dashboard/profile/edit" />
          }
        }else{
          return <Component {...props} />
        }
    }} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.user.uid,
  name: state.user.name,
  role: state.user.role,
  emailVerified: state.user.emailVerified
});

export default connect(mapStateToProps)(PublicRoute);
