import React, { Component } from 'react';
import RenderRole from '../../RenderRole'
import IsLoggedIn from '../../IsLoggedIn'
import Doctor from './Doctor'
import Patient from './Patient'
import { resizePageWrapper } from '../../../functions'

class Dashboard extends Component{
    componentDidMount(){
        resizePageWrapper()
    }

    render(){
        return <RenderRole {...this.props} patient={Patient} doctor={Doctor} />
    }
}

export default IsLoggedIn(Dashboard)
//export default Dashboard