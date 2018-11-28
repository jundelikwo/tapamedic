import React, { Component } from 'react'
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'
import IsLoggedIn from '../../IsLoggedIn'
import { resizePageWrapper } from '../../../functions'
class Profile extends Component{
    componentDidMount(){
        resizePageWrapper()
    }

    render(){
        return <RenderRole {...this.props} patient={Patient} doctor={Doctor} />
    }
}


export default IsLoggedIn(Profile);