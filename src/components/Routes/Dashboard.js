import React, { Component } from 'react';
import PrivateRoute from '../PrivateRoute'
import Header from '../UserHeader'
import Main from '../UserMain'
import Nav from '../UserNav'
import Footer from '../UserFooter'
import Profile from './Profile'
import Payment from './Payment'

class Dashboard extends Component{
    render(){
        return (
            <div>
                <Nav/>
                <Header/>
                <PrivateRoute exact path='/dashboard' component={Main}/>
                <PrivateRoute exact path='/dashboard/profile' component={Profile}/>
                <PrivateRoute exact path='/dashboard/payment' component={Payment}/>
                <Footer/>
            </div>
        )
    }
}

export default Dashboard