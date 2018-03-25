import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import firebase from 'firebase'

class Home extends Component{
    render(){
        return(
            <div>
                <h2>This is The Home Page</h2>
                <Link to="/login">Login</Link>
                <Link to="/createProfile">createProfile</Link>
                <Link to="/dashboard">dashboard</Link>
                {/* <button onClick={() => firebase.auth().signOut()}>Logout</button> */}
            </div>
        )
    }
}

export default Home