import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { toggleRole } from '../../../actions'
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'
import Header from '../../Header';
import Footer from '../../Footer';

let originalPageFontSize;

class Login extends Component{
    componentDidMount() {
        let htmlElem = window.$('html')
        originalPageFontSize = htmlElem.css('font-size')
        htmlElem.css('font-size','13.5px')
    }

    componentWillUnmount() {
        window.$('html').css('font-size',originalPageFontSize)
    }

    toggleRole = () => {
        this.props.dispatch(toggleRole())
    }

    render(){
        const { alternateRole, role } = this.props
        return (
            <div>
                <Header activeRouteTitle="Login" />
                <div className="about-bottom" style={{ backgroundColor: '#fff' }}>
                    <div className="container">
                        <div className="col-md-6 about-customize wow fadeInRight" data-wow-delay="0.5s">
                            <p>You are currently registering as a <b>{role.toUpperCase()}</b></p>
                            <RenderRole patient={Patient} doctor={Doctor} />
                            <br/>
                            <button onClick={this.toggleRole} className="btn btn-info">
                                Click me to register as a {alternateRole}
                            </button>
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

const mapStateToProps = state => {
    const { role } = state.user
    return {
        role,
        alternateRole: role === 'patient' ? 'Doctor' : 'Patient'
    }
}

export default connect(mapStateToProps)(Login)