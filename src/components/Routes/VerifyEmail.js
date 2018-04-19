import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import IsLoggedIn from '../IsLoggedIn'

class VerifyEmail extends Component{
    constructor(props){
        super(props)
        this.sendEmailVerification = this.sendEmailVerification.bind(this)
    }
    componentWillMount(){
        this.sendEmailVerification()
    }
    sendEmailVerification(){
        var user = firebase.auth().currentUser;
        
        user.sendEmailVerification().then(function() {
          // Email sent.
        }).catch(function(error) {
          // An error happened.
        });
    }
    render(){
        if(this.props.emailVerified){
            return <Redirect to="/dashboard/profile/edit" />
        }else{
            return (
                <div>
                    <p>We have sent you a link to your email to verify it. Kindly go to your email and click it</p>
                    <p>If you got no email, </p>
                    <button onClick={this.sendEmailVerification} type="submit" className="btn btn-primary">Click me to resend Verification Link</button>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        emailVerified: state.user.emailVerified
    }
}

export default IsLoggedIn(connect(mapStateToProps)(VerifyEmail))