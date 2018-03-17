import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = (props) => {
    let { component: Component } = props
    return (
    <Route {...props.routeProps} render={() => (
        props.logged_in ? (
            <Component/>
            ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} /> )
        )} 
    />
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        logged_in: state.user.uid,
        location: ownProps.path,
        routeProps: {
            exact: ownProps.exact,
            path: ownProps.path
        }
    };
};

export default connect(mapStateToProps, null, null, { pure: false })(PrivateRoute)