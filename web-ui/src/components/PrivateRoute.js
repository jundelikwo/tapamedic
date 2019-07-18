import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'


const PrivateRoute = ({
    isAuthenticated,
    component: Component,
    ...rest
  }) => (
      <Route {...rest} component={(props) => {
        if(isAuthenticated){
            return <Component {...props} />
        }else{
            return <Redirect to="/login" />
        }
      }} />
    );
  
const mapStateToProps = (state) => ({
    isAuthenticated: !!state.user.uid
});
  
export default connect(mapStateToProps)(PrivateRoute);