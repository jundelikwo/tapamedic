import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'
import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'
import { enterMessagesRoute, leaveMessagesRoute } from '../../../actions'
import { resizePageWrapper } from '../../../functions'
import { ConsultationDurationMilliSeconds } from '../../../config'

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
        const { consultations, location } = this.props
        const { consultId } = location.state
        let consultationOnGoing = false
        if(consultId in consultations){
            consultationOnGoing = new Date().getTime() <= consultations[consultId].startTime + ConsultationDurationMilliSeconds
        }
        return(
            <div id="page-wrapper" className={consultationOnGoing ? 'consultation-on-going' : ''} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="main-page" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <RenderRole 
                        {...this.props}
                        patient={Patient}
                        doctor={Doctor} 
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        consultations: state.consultations
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Messages))