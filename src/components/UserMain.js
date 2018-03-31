import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import IsLoggedIn from './IsLoggedIn'

class Main extends Component{
    render(){
        return(
            <div id="page-wrapper">
                <div className="main-page">
                    <div className="blank-page widget-shadow scroll" id="style-2 div1">
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

export default IsLoggedIn(Main)