import React, { Component } from 'react';
import firebase from 'firebase'
import { connect } from 'react-redux'
import firebaseui from 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'

class DoctorLogin extends Component{
    state = {
        redirect: false
    }
    getUIConfig = () => {
        return {
            'callbacks': {
              // Called when the user has been successfully signed in.
              'signInSuccess': function(user, credential, redirectUrl) {
                console.log("User",user)
                // user.sendEmailVerification().then(function() {
                //     // Email sent.
                //   }).catch(function(error) {
                //     // An error happened.
                //   });
                return false;
              }
            },
            // Opens IDP Providers sign-in flow in a popup.
            'signInFlow': 'popup',
            'credentialHelper': firebaseui.auth.CredentialHelper.NONE,
            'signInOptions': [
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    // Whether the display name should be displayed in Sign Up page.
                    requireDisplayName: false
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

export default connect(mapStateToProps)(DoctorLogin)