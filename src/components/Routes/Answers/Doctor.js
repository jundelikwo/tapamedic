import React, { Component } from 'react'
import { connect } from 'react-redux'

import IsLoggedIn from '../../IsLoggedIn'
import { toTitleCase } from '../../../functions/'
import { answerAQuestion } from '../../../actions'

class Answers extends Component{
    state = {
        answer: '',
        hasError: false,
        status: null
    }

    constructor(){
        super()
        this.onFieldChange = this.onFieldChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }
    // componentWillMount(){
    //     this.setState({
    //         ask: this.props.ask
    //     })
    // }
    // componentWillUnmount(){
    //     this.props.dispatch(addPatientQuestionToStore(this.refs.ask.value))
    // }
    onFieldChange(e){
        e.preventDefault()
        this.setState({ answer: e.target.value, hasError: false })
    }
    onFormSubmit(e){
        e.preventDefault()
        const answer = this.refs.answer.value || ''
        if(answer.match(/[a-zA-Z]/)){
            this.props.dispatch(answerAQuestion(this.props.id,answer))
            //this.props.dispatch(removePatientQuestionFromStore())
            this.setState({ hasError: false, answer: '' })
        }else{
            this.setState({ hasError: true })
        }
    }
    render(){
        const { answer, hasError, status } = this.state
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold' }}>{toTitleCase(this.props.title)}</h2>
                        <form className="form-horizontal" onSubmit={this.onFormSubmit}>
                            <div className={hasError ? "form-group has-error" : "form-group has-feedback"}> 
                                <div style={{ padding: 0 }} className="col-md-8">
                                    <textarea ref="answer" value={answer} onChange={this.onFieldChange} type="text" className="form-control" id="answerAQuestion" aria-describedby="answerAQuestionStatus" placeholder="Answer This Question"/>
                                </div>
                                {hasError ?
                                    <div className="alert alert-danger" role="alert">
                                        <strong>Error</strong> Your Answer must contain alphabets and cannot be empty
                                    </div>
                                    : null
                                }
                                {status ?
                                    <div className="alert alert-success" role="alert">
                                        <strong>Well Done</strong> Your Answer Has Been Saved
                                    </div>
                                    : null
                                }
                                <div className="col-md-12" style={{ padding: 0, marginLeft: 0 }}><button type="submit" className="btn btn-primary">Answer</button></div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Answers))