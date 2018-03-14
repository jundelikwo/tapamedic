import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'


class Login extends Component{
    state = {
        redirect: false
    }
    constructor(props){
        super(props)
        this.getUIConfig = this.getUIConfig.bind(this)
    }
    getUIConfig(){
        var that = this
        var redirect = () => {
            that.setState({ 'redirect': true })
        }
        return {
            'callbacks': {
              // Called when the user has been successfully signed in.
              'signInSuccess': function(user, credential, redirectUrl) {
                console.log("User",user)
                redirect()
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
        return this.state.redirect ?
            <Redirect to="/createprofile" />:
            <StyledFirebaseAuth uiConfig={this.getUIConfig()} firebaseAuth={firebase.auth()}/>
    }
}

export default Login