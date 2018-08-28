import React, {Component} from 'react';
import { connect } from 'react-redux'

class QuestionsList extends Component {
    renderQuestions() {
        const { questions } = this.props
        console.log('this.props.questions',questions)
        const questionKeys = Object.keys(questions)

        return questionKeys.map(key => {
            const { text,language } = questions[key]
            return (
                <a key={key} className="questions">
                    <div className="main-page">
                        <div className="blank-page widget-shadow scroll" id="style-2 div1">
                            <p>Question added &nbsp;&nbsp;*&nbsp;&nbsp; Language {language}</p>
                            <h2>{text}</h2>
                        </div>
                    </div>
                </a>
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