import React from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import firebase from 'firebase'

import { goOffline } from '../actions/'

const Header = props => (
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
                        <li className="active"><a className="scroll">{props.activeRouteTitle}</a></li>
                        {!props.isLoggedIn ? null : (
                            <li> <a onClick={(e) => {
                                e.preventDefault()
                                props.dispatch(goOffline())
                                firebase.auth().signOut()
                            }}>Logout</a> </li>
                        )}
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
)

const mapStateToProps = state => {
    return {
        isLoggedIn: !!state.user.uid
    }
}

export default connect(mapStateToProps)(Header)