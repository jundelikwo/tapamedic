import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'
import RenderRole from '../../RenderRole'
//import Doctor from './Doctor'
//import Patient from './Patient'
import { enterMessagesRoute, leaveMessagesRoute } from '../../../actions'
import { resizePageWrapper } from '../../../functions'

let Doctor,Patient
Doctor = Patient = () => (<div>Hello</div>)


class Messages extends Component{
    componentWillMount(){
        this.props.dispatch(enterMessagesRoute(this.props.consultId))
    }

    componentDidMount(){
        resizePageWrapper()
    }

    componentWillUnmount(){
        this.props.dispatch(leaveMessagesRoute())
    }

    render(){
        console.log('Messages',this.props)
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">      
                        <RenderRole 
                            {...this.props}
                            patient={Patient}
                            doctor={Doctor} 
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const { consultId } = ownProps.location.state
    return {
        consultation: state.consultations[consultId],
        consultId
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Messages))