import React, { Component } from 'react';
import { connect } from 'react-redux'

import IsLoggedIn from './IsLoggedIn'
import { sendMessage } from '../actions'
import { ConsultationDurationMilliSeconds } from '../config'

class Footer extends Component{
    state = {
        message: ""
    }

    componentDidMount(){
        if(this.props.isMessagesRoute){
            window.scrollTo(0,window.document.body.scrollHeight);
        }
    }

    onWriteMsg = evt => {
        evt.preventDefault()
        this.setState({ message: evt.target.value })
    }

    sendMsg = evt => {
        evt.preventDefault()
        if(this.state.message.length){
            this.props.dispatch(sendMessage(this.props.consultId,this.state.message))
            this.setState({ message: "" })
            window.scrollTo(0,window.document.body.scrollHeight);
        }
    }

    renderMessageForm = () => {
        const { message } = this.state
        let sendBtnClass = message.length ? "btn btn-primary" : "btn disabled"
        return (
            <form className="form-horizontal readOnly" onSubmit={this.sendMsg}>
                <div className="form-group mb-n" style={{ marginBottom: 0 }}>
                    <div className="col-sm-8" style={{ height: 30 }}>
                        <textarea placeholder="Write your message" onChange={this.onWriteMsg} value={message} className="form-control1" style={{ padding: 0, margin: 0, height: 30 }} />
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-info" style={{ marginRight: 5 }}><i className="fa fa-image"/></button>
                        <button type="submit" className={sendBtnClass}>Send</button>
                    </div>
                </div>
            </form>
        )
    }

    render(){
        const { isMessagesRoute, consultations, consultId } = this.props
        let allowWrite = false;
        if(isMessagesRoute){
            if(consultId in consultations){
                allowWrite = new Date().getTime() <= consultations[consultId].startTime + ConsultationDurationMilliSeconds
            }
        }
        return (
            <div className={allowWrite ? "footer messages" : "footer"}>
                {allowWrite ? this.renderMessageForm() : (
                    <p>&copy; 2018 Tapamedic.com. All Rights Reserved | Design by <a href="https://w3layouts.com/" target="_blank" rel="noopener noreferrer">w3layouts</a></p>
                )}       
            </div>
        )
    }
}

const mapStateToProps = ({ consultations, router }) => {
    return {
        ...router,
        consultations,
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Footer))