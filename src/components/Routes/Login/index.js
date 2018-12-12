import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import { toggleRole } from '../../../actions'
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'

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
                <div className="banner" style={{ minHeight: 'auto' }}>
                    <div className="container">
                        <div className="header">
                            <div className="logo wow fadeInLeft" data-wow-delay="0.5s" style={{ height: 50, overflowY: "hidden"}}>
                                <NavLink to='/'><img src="/images/logoLG.svg" alt="" style={{width: 220}}/></NavLink>
                            </div>
                            <div className="top-menu">
                            <span className="menu"></span>
                                <ul>
                                    <li><NavLink to='/'>Home</NavLink></li>
                                    <li className="active"><a className="scroll">Login</a></li>
                                </ul>
                            </div>  	

                            <div className="clearfix"/>
                        </div>
                        <div className="banner-info">
                            <div className="banner-text wow fadeInRight" data-wow-delay="0.5s" style={{ width: '100%' }}>
                                <h3>introducing tap a medic</h3>
                                <h1>Quality & Affordable healthcare without stress</h1>
                            </div>
                            <div className="clearfix"/>
                        </div>
                    </div>
                </div>
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
                <div className="footer text-center" id="footer-home">
                    <div className="container">
                        <div className="social">			 
                            <a href="#"><span className="behance"></span></a>
                            <a href="#"><span className="dribble"></span></a>
                            <a href="#"><span className="twitter"></span></a>
                            <a href="#"><span className="facebook"></span></a>
                            <a href="#"><span className="NavLinkedin"></span></a>
                        </div>
                        <p className="wow bounceIn" data-wow-delay="0.4s">Copyright &copy; 2018 TAPAMEDIC All rights reserved</p>
                    </div>
                </div>
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