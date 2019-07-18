import React, { Component } from 'react'
import { connect } from 'react-redux'
import IsLoggedIn from '../../IsLoggedIn'
import QuestionsList from '../../QuestionsList'
import { addPatientQuestionToStore, removePatientQuestionFromStore, askQuestion } from '../../../actions'

class Questions extends Component{
    state = {
        ask: '',
        hasError: false
    }

    constructor(){
        super()
        this.onFieldChange = this.onFieldChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }
    componentWillMount(){
        this.setState({
            ask: this.props.ask
        })
    }
    componentWillUnmount(){
        this.props.dispatch(addPatientQuestionToStore(this.refs.ask.value))
    }
    onFieldChange(e){
        e.preventDefault()
        this.setState({ ask: e.target.value, hasError: false })
    }
    onFormSubmit(e){
        e.preventDefault()
        const question = this.refs.ask.value || ''
        if(question.match(/[a-zA-Z]/)){
            this.props.dispatch(askQuestion(question))
            this.props.dispatch(removePatientQuestionFromStore())
            this.setState({ hasError: false, ask: '' })
        }else{
            this.setState({ hasError: true })
        }
    }
    render(){
        const { language, status } = this.props
        const { ask, hasError } = this.state
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        <form className="form-horizontal" onSubmit={this.onFormSubmit}>
                            <div className={hasError ? "form-group has-error" : "form-group has-feedback"}> 
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold' }}><label style={{ textAlign: 'left' }} className="control-label" htmlFor="askAQuestion">Got a Question On Your Mind Ask One of Our Doctors Here</label></h2>
                                <div style={{ padding: 0 }} className="col-md-8">
                                    <textarea ref="ask" value={ask} onChange={this.onFieldChange} type="text" className="form-control" id="askAQuestion" aria-describedby="askAQuestionStatus" placeholder="Ask a Question"/>
                                </div>
                                <p style={{ padding: 0, marginLeft: 0 }} className="help-block col-md-4">You are currently asking in {language}</p>
                                {hasError ?
                                    <div className="alert alert-danger" role="alert">
                                        <strong>Error</strong> Your Question must contain alphabets and cannot be empty
                                    </div>
                                    : null
                                }
                                {status ?
                                    <div className="alert alert-success" role="alert">
                                        <strong>Well Done</strong> Your Question Has Been Asked
                                    </div>
                                    : null
                                }
                                <div className="col-md-12" style={{ padding: 0, marginLeft: 0 }}><button type="submit" className="btn btn-primary">Ask</button></div>
                            </div>
                        </form>
                        <div className="clearfix" />
                    </div>
                </div>
                <QuestionsList/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.user.language,
        ask: state.questions.ask,
        status: state.questions.askedQuestionStatus
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Questions))