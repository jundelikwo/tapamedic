import React, { Component } from 'react'
import { connect } from 'react-redux'

class MessageItem extends Component{
    renderOtherUserName = () => {
        const { isMe, role, consultation } = this.props
        if(isMe){
            return null
        }else if(role === 'doctor'){
            return <div>{consultation.patient.name}</div>
        }
        return <div>Dr. {consultation.doctor.name}</div>
    }

    renderPhoto = () => {
        const { isMe, photoURL, role, consultation } = this.props
        if(isMe){
            return photoURL
        }else if(role === 'patient'){
            return consultation.doctor.photo
        }else{
            return consultation.patient.photo
        }
    }

    renderMsg = () => {
        const { message, thumb } = this.props
        return message ? message : <img src={thumb} />
    }

    render(){
        console.log('MessageItem',this.props)
        const { isMe } = this.props
        return (
            <div className={isMe ? 'messageItem isMe' : 'messageItem'}>
                <div>{this.renderMsg()}</div>
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    const { consultations, messages, user } = state
    const { consultId } = ownProps
    return {
        consultation: consultations[consultId],
        role: user.role,
        isMe: user.uid === ownProps.user,
        photoURL: user.photoURL
    }
}

export default connect(mapStateToProps)(MessageItem)