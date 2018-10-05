import React, { Component } from 'react'
import IsLoggedIn from '../../IsLoggedIn'
import QuestionsList from '../../QuestionsList'

class Questions extends Component{
    render(){
        console.log('Questions',this.props)
        return(
            <div id="page-wrapper">
                <QuestionsList/>
            </div>
        )
    }
}

export default IsLoggedIn(Questions)