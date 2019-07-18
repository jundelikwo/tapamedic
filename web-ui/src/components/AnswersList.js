import React, {Component} from 'react';
import { connect } from 'react-redux'

class AnswersList extends Component {
    renderAnswers() {
        if(this.props.answers){
            if(this.props.answers.answersCount){
                const { answers } = this.props.answers
                console.log('this.props.answers',answers)
                const answerKeys = Object.keys(answers)

                return answerKeys.map(key => {
                    const { text,name,photo } = answers[key]
                    return (
                        <div key={key} className="main-page">
                            <div className="blank-page widget-shadow scroll" id="style-2 div1" style={{ padding: '0' }}>
                                <div className="profile_details blank-page" style={{ float: 'none', borderBottom: '2px solid grey' }}>
                                    <div className="profile_img">
                                        <span className="prfil-img"><img style={{ height: '50px', width: '50px' }} src={photo} alt=""/> </span> 
    									<div className="user-name">
    										<p>Dr. {name}</p>
    									</div>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                                <div className="blank-page">
                                    <p>{text}</p>
                                </div>
                            </div>
                        </div>
                    )
                })
            }else{
                return (
                    <div className="main-page">
                        <div className="blank-page widget-shadow scroll" id="style-2 div1" style={{ padding: '0' }}>
                            <div className="profile_details blank-page" style={{ float: 'none' }}>
                                <div className="profile_img">
                                    <div className="user-name">
                                        <p>This Question has no answer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }
    }
    
    render(){
        console.log('AnswersList',this.props.answers)
        return (
            <div style={{ marginTop: 20 }}>
                {this.props.answers && this.props.answers.answersCount ? 
                    <h2>
                        {this.props.answers.answersCount}&nbsp;
                        {this.props.answers.answersCount > 1 ? <span>answers</span> : <span>answer</span>}
                </h2> : null }
                {this.renderAnswers()}
            </div>
        )
    }
}

const mapStateToProps = (state,ownProps) => {
    let slug = ownProps.match.params.slug
    return {
        answers: state.answers.answers[slug]
    }
}

export default connect(mapStateToProps)(AnswersList)