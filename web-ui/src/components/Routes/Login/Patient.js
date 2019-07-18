import React, { Component } from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'


class PatientLogin extends Component{
    state = {
        redirect: false
    }
    getUIConfig = () => {
        // var that = this
        // var redirect = () => {
        //     that.setState({ 'redirect': true })
        // }
        return {
            'callbacks': {
              // Called when the user has been successfully signed in.
              'signInSuccess': function(user, credential, redirectUrl) {
                console.log("User",user)
                //redirect()
                //handleSignedInUser(user);
                // Do not redirect.
                return false;
              }
            },
            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',
            'signInOptions': [
              {
                provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                recaptchaParameters: {
                  size: "invisible"
                },
                defaultCountry: 'NG'
              }
            ],
            // Terms of service url.
            'tosUrl': 'https://www.google.com'
        };
    }
    render(){
        return (
            <div style={{ marginTop: '30px' }}>
                <StyledFirebaseAuth uiConfig={this.getUIConfig()} firebaseAuth={firebase.auth()}/>        
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loggedIn: state.user.uid,
        name: state.user.name
    }
}

export default connect(mapStateToProps)(PatientLogin)