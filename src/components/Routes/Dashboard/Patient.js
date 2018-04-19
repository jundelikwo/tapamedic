import React, { Component } from 'react';
import PrivateRoute from '../../PrivateRoute'
import IsLoggedIn from '../../IsLoggedIn'
import Header from '../../UserHeader'
import Main from '../../UserMain'
import Nav from '../../UserNav'
import Footer from '../../UserFooter'
import Profile from '../Profile/'
import Payment from '../Payment/'
import Questions from '../Questions/'
import TalkToADoc from '../TalkToADoc/'

class PatientDashboard extends Component{
    render(){
        const { match } = this.props
        return (
            <div>
                <Nav/>
                <Header/>
                <PrivateRoute exact path={match.path} component={Main}/>
                <PrivateRoute exact path={match.path + '/questions'} component={Questions}/>
                <PrivateRoute exact path={match.path + '/talk-to-a-doc'} component={TalkToADoc}/>
                <PrivateRoute path={match.path + '/profile'} component={Profile}/>
                <PrivateRoute exact path={match.path + '/payment'} component={Payment}/>
                <Footer/>
            </div>
        )
    }
}

export default IsLoggedIn(PatientDashboard)
//export default Dashboard