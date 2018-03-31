import React, { Component } from 'react';
import PrivateRoute from '../PrivateRoute'
import IsLoggedIn from '../IsLoggedIn'
import Header from '../UserHeader'
import Main from '../UserMain'
import Nav from '../UserNav'
import Footer from '../UserFooter'
import Profile from './Profile'
import Payment from './Payment'
import Questions from './Questions'
import TalkToADoc from './TalkToADoc'

class Dashboard extends Component{
    render(){
        return (
            <div>
                <Nav/>
                <Header/>
                <PrivateRoute exact path='/dashboard' component={Main}/>
                <PrivateRoute exact path='/dashboard/questions' component={Questions}/>
                <PrivateRoute exact path='/dashboard/talk-to-a-doc' component={TalkToADoc}/>
                <PrivateRoute exact path='/dashboard/profile' component={Profile}/>
                <PrivateRoute exact path='/dashboard/payment' component={Payment}/>
                <Footer/>
            </div>
        )
    }
}

export default IsLoggedIn(Dashboard)