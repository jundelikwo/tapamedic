import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'
import { toTitleCase } from '../../../functions/'

class Answers extends Component{
    render(){
        console.log('Answers',this.props)
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold' }}>{toTitleCase(this.props.title)}</h2>
                    </div>
                </div>
                {this.props.content}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Answers))