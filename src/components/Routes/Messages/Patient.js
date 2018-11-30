import React, { Component } from 'react'
import { connect } from 'react-redux'

import MessagesList from '../../MessagesList'

class Patient extends Component {
    render(){
        return (
            <div className="blank-page widget-shadow scroll" id="style-2 div1" style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                <MessagesList consultId={this.props.location.state.consultId} />
            </div>
        )
    }
}

export default Patient