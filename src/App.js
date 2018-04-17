import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import PublicRoute from './components/PublicRoute'
import CreateProfile from './components/Routes/CreateProfile'
import Dashboard from './components/Routes/Dashboard'
import Home from './components/Routes/Home'
import Login from './components/Routes/Login'
import ErrorBoundary from './components/ErrorBoundary'

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
            <PrivateRoute path="/createprofile" component={CreateProfile}/>
            <PrivateRoute path="/dashboard" component={Dashboard}/>
            <PublicRoute path="/login" component={Login}/>
          </Switch>
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
