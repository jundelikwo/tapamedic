import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Header from '../UserHeader'
import Main from '../UserMain'
import Nav from '../UserNav'
import Footer from '../UserFooter'
import Profile from './Profile'

class Dashboard extends Component{
    render(){
        return (
            <div>
                <Nav/>
                <Header/>
                <Route exact path='/dashboard' component={Main}/>
                <Route exact path='/dashboard/profile' component={Profile}/>
                <Footer/>
            </div>
        )
    }
}

export default Dashboard