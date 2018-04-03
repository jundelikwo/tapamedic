import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = (props) => {
    let { component: Component } = props
    return (
        <Route {...props.routeProps} render={(routeProps) => (
            props.loggedIn ? (
                <Component {...routeProps}/>
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
        loggedIn: state.user.uid,
        location: ownProps.path,
        routeProps: {
            exact: ownProps.exact,
            path: ownProps.path
        }
    };
};

export default connect(mapStateToProps, null, null, { pure: false })(PrivateRoute)