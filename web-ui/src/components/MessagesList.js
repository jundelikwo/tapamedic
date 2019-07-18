import React, { Component } from 'react'
import { connect } from 'react-redux'

import MessageItem from './MessageItem'

class MessagesList extends Component{
    renderMessages = () => {
        const { consultId, messages } = this.props
        return Object.keys(messages).map(key => <MessageItem key={key} consultId={consultId} {...messages[key]} />)
    }

    render(){
        console.log('MessagesList',this.props.messages)
        return (
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
                {this.renderMessages()}
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    const { consultId } = ownProps
    return {
        consultation: state.consultations[consultId],
        messages: state.messages[consultId] || {}
    }
}

export default connect(mapStateToProps)(MessagesList)