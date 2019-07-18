import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import firebase from 'firebase'
import IsLoggedIn from '../IsLoggedIn'
import Header from '../Header';
import Footer from '../Footer';

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
                    <Header activeRouteTitle="Verify Email" />
                    <div className="about-bottom" style={{ backgroundColor: '#fff' }}>
                        <div className="container">
                            <div className="col-md-6 about-customize wow fadeInRight" data-wow-delay="0.5s">
                                <p>We have sent you a link to your email to verify it. Kindly go to your email and click it</p>
                                <p>If you got no email, </p>
                                <button onClick={this.sendEmailVerification} className="btn btn-primary">Click me to resend Verification Link</button>
                                <p>If you have verified your email, </p>
                                <button onClick={()=>{
                                    window.location = window.location = '/dashboard'
                                }} className="btn btn-primary">Click me to continue</button>
                            </div>
                            <div className="col-md-6 about-device-bottom wow fadeInLeft" data-wow-delay="0.5s">
                                <img src="/images/phn3.jpg" alt=""/>
                            </div>
                            <div className="clearfix"/>
                        </div>
                    </div>
                    <Footer />
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