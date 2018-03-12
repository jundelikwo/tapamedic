import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component{
    render(){
        return (
            <div>
                <Link to="/dashboard">Click to go to the dashboard</Link>
            </div>
        )
    }
}

export default Home