import React, { Component } from 'react';
import { connect } from 'react-redux'
import logo from '../../../logo.svg';
import IsLoggedIn from '../../IsLoggedIn'

class Main extends Component{
    render(){
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
                        {this.props.review ?
                            <div className="alert alert-success" role="alert">
                                <strong>Well done!</strong> Your application is under review we will reach back to you within 2 - 3 working days
                            </div>
                            : null
                        }
                        <div className="App">
                            <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <h1 className="App-title">Welcome to React</h1>
                            </header>
                            <p className="App-intro">
                            To get started, edit <code>src/App.js</code> and save to reload.
                            </p>
                        </div>
                    </div>
			    </div>
		    </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        review: state.doctorProfile.review
    }
}

export default connect(mapStateToProps)(IsLoggedIn(Main))