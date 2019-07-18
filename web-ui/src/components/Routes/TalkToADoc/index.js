import React, { Component } from 'react'
import IsLoggedIn from '../../IsLoggedIn'

import RenderRole from '../../RenderRole'
import Doctor from './Doctor'
import Patient from './Patient'

import { resizePageWrapper } from '../../../functions'

class TalkToADoc extends Component{
    componentDidMount(){
        resizePageWrapper()
    }

    render(){
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

export default IsLoggedIn(TalkToADoc)