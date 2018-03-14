import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component{
    render(){
        return(
            <div>
                <h2>This is The Home Page</h2>
                <Link to="/login">Login</Link>
            </div>
        )
    }
}

export default Home