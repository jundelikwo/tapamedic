import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import Dashboard from './components/Routes/Dashboard'
import Home from './components/Routes/Home'

class App extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={Home}/>
        <Route path="/dashboard" component={Dashboard}/>
      </div>
    );
  }
}

export default App;
