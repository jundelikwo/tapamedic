import React, { Component } from 'react'
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'
import IsLoggedIn from '../../IsLoggedIn'

class Profile extends Component{
    render(){
        return <RenderRole {...this.props} patient={Patient} doctor={Doctor} />
    }
}


export default IsLoggedIn(Profile);