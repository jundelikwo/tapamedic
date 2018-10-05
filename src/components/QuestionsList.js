import React, {Component} from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom';

class QuestionsList extends Component {
    renderQuestions() {
        const { questions } = this.props
        console.log('this.props.questions',questions)
        const questionKeys = Object.keys(questions)

        return questionKeys.map(key => {
            const { text,language,slug } = questions[key]
            const linkAddress = "/dashboard/questions/" + slug
            return (
                <NavLink key={key} to={{
                    pathname: linkAddress,
                    state: { key }
                }} className="questions">
                    <div className="main-page">
                        <div className="blank-page widget-shadow scroll" id="style-2 div1">
                            <p>Question added &nbsp;&nbsp;*&nbsp;&nbsp; Language {language}</p>
                            <h2>{text}</h2>
                            <button className="btn btn-primary">View Answers</button>
                        </div>
                    </div>
                </NavLink>
            )
        })
    }
    
    render(){
        return (
            <div style={{ marginTop: 20 }}>
                {this.renderQuestions()}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        questions: state.questions.questions
    }
}

export default connect(mapStateToProps)(QuestionsList)