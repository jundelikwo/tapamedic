import React, { Component } from 'react';
import { connect } from 'react-redux'
import RenderRole from '../../RenderRole'
import IsLoggedIn from '../../IsLoggedIn'
import Doctor from './Doctor'
import Patient from './Patient'

import { startAddQuestionsList } from '../../../actions/'

class Questions extends Component{
    componentWillMount(){
        if(this.props.shouldFetchQuestions){
            console.log('Fetching Questions')
            this.props.dispatch(startAddQuestionsList())
        }
    }

    render(){
        return <RenderRole {...this.props} patient={Patient} doctor={Doctor} />
    }
}

const mapStateToProps = state => {
    return {
        shouldFetchQuestions: !state.questions.questions.length
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Questions))
//export default Dashboard