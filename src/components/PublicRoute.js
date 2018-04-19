import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({
  isAuthenticated,
  name,
  role,
  component: Component,
  ...rest
}) => (
    <Route {...rest} component={(props) => {
        if(isAuthenticated){
          if(name){
            return <Redirect to="/dashboard" />
          }else if(role === 'patient'){
            return <Redirect to="/dashboard/profile/edit" />
          }else{
            return <Redirect to="/dashboard/verifyEmail" />
          }
        }else{
          return <Component {...props} />
        }
    }} />
  );

const mapStateToProps = (state) => ({
  isAuthenticated: !!state.user.uid,
  name: state.user.name,
  role: state.user.role
});

export default connect(mapStateToProps)(PublicRoute);
