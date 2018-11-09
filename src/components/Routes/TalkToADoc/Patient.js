import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'

class Patient extends Component{
    render(){
        console.log('Patient',this.props.doctors)
        return null;
    }
}

const mapStateToProps = state => {
    return {
        doctors: state.doctors
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Patient))