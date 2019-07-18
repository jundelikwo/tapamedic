import React, { Component } from 'react'
import { connect } from 'react-redux'
import { preloadScript } from 'opentok-react';

import WebRTC from './WebRTC'
import IsLoggedIn from '../../IsLoggedIn'
import RenderRole from '../../RenderRole'
import { enterMessagesRoute, leaveMessagesRoute } from '../../../actions'
import { resizePageWrapper } from '../../../functions'
import { ConsultationDurationMilliSeconds } from '../../../config'
import MessagesList from '../../MessagesList'

class Messages extends Component{
    componentWillMount(){
        this.props.dispatch(enterMessagesRoute(this.props.location.state.consultId))
    }

    componentDidMount(){
        resizePageWrapper()
    }

    componentWillUnmount(){
        this.props.dispatch(leaveMessagesRoute())
    }

    render(){
        const { consultations, location, role } = this.props
        const { consultId } = location.state
        let consultationOnGoing = false
        let session, token, webrtc, photo
        if(consultId in consultations){
            let consultation = consultations[consultId];
            const { opentok, startTime } = consultation
            session = opentok.session
            token = opentok.token
            webrtc = opentok.webrtc
            console.log('consultation',consultation)
            consultationOnGoing = new Date().getTime() <= startTime + ConsultationDurationMilliSeconds

            photo = role === 'doctor' ? consultation.patient.photo : consultation.doctor.photo
        }
        const shouldShowWebRTCChat = consultationOnGoing && (webrtc === 'video' || webrtc === 'audio')
        return(
            <div id="page-wrapper" className={consultationOnGoing ? 'consultation-on-going consultation-wrapper' : 'consultation-wrapper'}>
                <div className="main-page">
                    {shouldShowWebRTCChat ? <WebRTC consultationId={consultId} session={session} token={token} publishVideo={webrtc === 'video'} photo={photo}/> : null}
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        {shouldShowWebRTCChat ? null : <MessagesList consultId={consultId} />}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        consultations: state.consultations,
		role: state.user.role
    }
}

export default preloadScript(connect(mapStateToProps)(IsLoggedIn(Messages)))