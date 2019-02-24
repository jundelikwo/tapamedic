import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';
import { initiateWebRTC } from '../../actions';

class Message extends Component {
    goBack = () => {
        this.props.history.goBack()
    }

    render(){
        const { allowWrite, name, consultationId, photo } = this.props
        return (
            <div className="sticky-header header-section" style={{ display: 'flex' }}>
                <div className="header-left" style={{ flex: 1, float: 'none' }}>				
                    <button id="showLeftPush" onClick={this.goBack}><i className="fa fa-arrow-left"></i></button>
                    
                    <div className="profile_details_left">
                        <div>
                            <img src={photo} style={{ height: 50, width: 50, borderRadius: '50%', float: 'left' }} />
                            <p style={{ overflow: 'hidden', height: 50, display: 'flex', alignItems: 'center' }}>{name}</p>
                        </div>
                        <div className="clearfix"> </div>
                    </div>
                    <div className="clearfix"> </div>
                </div>

                <div className="header-right" style={{ flex: 1, float: 'none', display: 'block' }}>
                    {allowWrite ?
                        <div style={{ float: 'right' }}>
                            <button onClick={() => this.props.dispatch(initiateWebRTC('video', consultationId))} className="btn btn-danger" style={{ marginRight: 5, marginTop: 10 }}><i className="fa fa-video-camera"/></button>
                            <button onClick={() => this.props.dispatch(initiateWebRTC('audio', consultationId))} className="btn btn-danger" style={{ marginRight: 5, marginTop: 10 }}><i className="fa fa-phone"/></button>
                        </div>
                    : null}
                    <div className="clearfix"> </div>		
                </div>
                <div className="clearfix"> </div>	
		    </div>
        )
    }
}

export default connect(null)(withRouter(Message))