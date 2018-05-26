import React, { Component } from 'react'
import { connect } from 'react-redux'
import IsLoggedIn from '../../IsLoggedIn'

class Questions extends Component{
    render(){
        const { language } = this.props
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        <form className="form-horizontal">
                            <div className="form-group has-feedback"> 
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold' }}><label style={{ textAlign: 'left' }} className="control-label" htmlFor="askAQuestion">Got a Question On Your Mind Ask One of Our Doctors Here</label></h2>
                                <div style={{ padding: 0 }} className="col-md-8">
                                    <textarea type="text" className="form-control" id="askAQuestion" aria-describedby="askAQuestionStatus" placeholder="Ask a Question"/>
                                </div>
                                <p style={{ padding: 0, marginLeft: 0 }} className="help-block col-md-3">You are currently asking in {language}</p>
                            </div>
                        </form>
                        <div className="clearfix" />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.user.language
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Questions))