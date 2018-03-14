import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import CreateProfile from './components/Routes/CreateProfile'
import Dashboard from './components/Routes/Dashboard'
import Home from './components/Routes/Home'
import Login from './components/Routes/Login'

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Home}/>
        <Route path="/createprofile" component={CreateProfile}/>
        <Route path="/dashboard" component={Dashboard}/>
        <Route path="/login" component={Login}/>
      </div>
    );
  }
}

export default App;
