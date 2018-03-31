import React, { Component } from 'react'
import IsLoggedIn from '../IsLoggedIn'

class Questions extends Component{
    render(){
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        Questions Page
                    </div>
                </div>
            </div>
        )
    }
}

export default IsLoggedIn(Questions)