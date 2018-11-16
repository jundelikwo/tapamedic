import React, { Component } from 'react'
import { connect } from 'react-redux'

import { acceptConsultation, rejectConsultation } from '../actions';

class ConsultationItem extends Component{
    render(){
        const { consultation, role, consultId } = this.props
        const { accepted, doctor, initTime, patient, started } = consultation
        let { name, photo, id } = role === 'doctor' ? patient : doctor
        let msg
        if(role !== 'doctor'){
            name = "Dr. " + name
            msg = <span>Waiting for the Doctor to accept</span>
        }else{
            name = name || 'Anonymous'
            photo = photo || '/images/default_avatar.png'
            msg = (
                <div>
                    <span>Wants to have a consultation</span>
                    <br/>
                    <button className="btn btn-info" onClick={() => {
                        this.props.dispatch(acceptConsultation(consultId))
                    }}>Accept</button>
                    &nbsp;
                    <button className="btn btn-danger" onClick={() => {
                        this.props.dispatch(rejectConsultation(consultId))
                    }}> X </button>
                </div>
            )
        }

        if(accepted === true){
            return (
                <div style={{ borderBottom: '2px solid grey', marginBottom: '10px', paddingBottom: '10px' }}>
                    <div style={{ float: 'none' }}>
                        <div className="profile_img">
                            <span className="prfil-img"><img style={{ height: '75px', width: '75px' }} src={photo} alt=""/> </span> 
                            <div className="user-name">
                                <p>{name}</p>
                                <button className="btn btn-success">View Messages</button>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className="alert alert-info" role="alert">
                    <div style={{ float: 'none' }}>
                        <div className="profile_img">
                            <span className="prfil-img"><img style={{ height: '75px', width: '75px' }} src={photo} alt=""/> </span> 
                            <div className="user-name">
                                <p>{name}</p>
                                {msg}
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        consultation: state.consultations[ownProps.consultId],
        role: state.user.role
    }
}

export default connect(mapStateToProps)(ConsultationItem)