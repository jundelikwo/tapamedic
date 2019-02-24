import React, { Component } from 'react';
import { connect } from 'react-redux'

import { ConsultationDurationMilliSeconds } from '../../config'
import RenderRole from '../RenderRole'
import IsLoggedIn from '../IsLoggedIn'
import Doctor from './Doctor'
import Message from './Message'
import Patient from './Patient'

class Header extends Component{
    render(){
        const { isMessagesRoute, consultations, consultId, role } = this.props
		let allowWrite = false;
		let photo
		let name
        if(isMessagesRoute){
            if(consultId in consultations){
				let consultation = consultations[consultId]
                allowWrite = new Date().getTime() <= consultations[consultId].startTime + ConsultationDurationMilliSeconds
				
				if(role === 'doctor'){
					photo = consultation.patient.photo
					name = consultation.patient.name
				}else{
					photo = consultation.doctor.photo
					name = 'Dr.' + consultation.patient.name
					name = name.substr(0,40)
				}
			}
        }
        return isMessagesRoute ? <Message allowWrite={allowWrite} consultationId={consultId} name={name} photo={photo} /> : <RenderRole {...this.props} patient={Patient} doctor={Doctor} />
    }
}

const mapStateToProps = (state) => {
	return {
		...state.router,
        consultations: state.consultations,
		role: state.user.role
	}
}

export default IsLoggedIn(connect(mapStateToProps)(Header))
//export default Dashboard