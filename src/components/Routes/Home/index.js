import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Home extends Component{
    render(){
        console.log('Props from Home',this.props)
        return(
            <div>
                <h2>This is The Home Page</h2>
                <Link to="/login">Login</Link>
                <br/>
                <Link to="/dashboard/profile">dashboard</Link>
            </div>
        )
    }
}

export default Home