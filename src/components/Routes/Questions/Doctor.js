import React, { Component } from 'react'
import IsLoggedIn from '../../IsLoggedIn'
import QuestionsList from '../../QuestionsList'

class Questions extends Component{
    render(){
        console.log('Questions',this.props)
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        Questions Page
                    </div>
                </div>
                <QuestionsList/>
            </div>
        )
    }
}

export default IsLoggedIn(Questions)