import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import Dashboard from './components/Routes/Dashboard/'
import Home from './components/Routes/Home/'
import Login from './components/Routes/Login/'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css';

if(process.env.NODE_ENV !== "development"){
  console.log = () => {}
}

class App extends Component {
  componentDidMount(){
    if(!window.$){
      window.location = '/dashboard'
    }
  }
  render() {
    return (
      <ErrorBoundary>
        <div>
          <Switch>
            <Route exact path="/" component={Home}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
            <PublicRoute path="/login" component={Login}/>
          </Switch>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
