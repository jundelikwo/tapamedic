import React, { Component } from 'react';
import { connect } from 'react-redux'
import RenderRole from '../../RenderRole'
import IsLoggedIn from '../../IsLoggedIn'
import Doctor from './Doctor'
import Patient from './Patient'
import AnswersList from '../../AnswersList'

import { fetchAnswers } from '../../../actions/'
import { resizePageWrapper } from '../../../functions'

class Answers extends Component{
    componentWillMount(){
        console.log('Answers Props',this.props)
        const { slug } = this.props
        const { id } = this.props
        this.props.dispatch(fetchAnswers(slug))
    }

    componentDidMount(){
        resizePageWrapper()
    }

    render(){
        return (
            <RenderRole
                content={<AnswersList match={this.props.match}/>}
                {...this.props}
                patient={Patient}
                doctor={Doctor} 
            />
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    let id = ownProps.location.state.key
    console.log('id',id)
    let slug = ownProps.match.params.slug
    return {
        shouldFetchQuestions: !Object.keys(state.questions.questions).length,
        title: state.questions.questions[id].text,
        slug,
        id
    }
}

export default IsLoggedIn(connect(mapStateToProps)(Answers))