import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import PrivateRoute from '../../PrivateRoute'
import IsLoggedIn from '../../IsLoggedIn'
import Header from '../../UserHeader/'
import Nav from '../../UserNav/'
import Footer from '../../UserFooter'
import Answers from '../Answers/'
import Profile from '../Profile/'
import Questions from '../Questions/'
import TalkToADoc from '../TalkToADoc/'
import Messages from '../Messages/'


class PatientDashboard extends Component{
    render(){
        const { match } = this.props
        let redirect = () => {
            return <Redirect to={match.path + '/profile'} />
        }
        return (
            <div>
                <Nav/>
                <Header/>
                <PrivateRoute exact path={match.path} component={redirect}/>
                <PrivateRoute exact path={match.path + '/questions'} component={Questions}/>
                <PrivateRoute exact path={match.path + '/questions/:slug'} component={Answers}/>
                <PrivateRoute exact path={match.path + '/talk-to-a-doc'} component={TalkToADoc}/>
                <PrivateRoute exact path={match.path + '/talk-to-a-doc/messages'} component={Messages}/>
                <PrivateRoute path={match.path + '/profile'} component={Profile}/>
                <Footer/>
            </div>
        )
    }
}

export default IsLoggedIn(PatientDashboard)
//export default Dashboard