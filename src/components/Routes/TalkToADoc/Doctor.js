import React, { Component } from 'react'
import { connect } from 'react-redux'

import ConsultationsList from '../../ConsultationsList'
import IsLoggedIn from '../../IsLoggedIn'

class Doctor extends Component{

    render(){
        return this.props.consultationsList.length ? <ConsultationsList/> : (
            <div>
                <h2 className="text-center h2">Oops!! You have no Consultation. Please try again later</h2>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        consultationsList: Object.keys(state.consultations),
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Doctor))