import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import firebase from 'firebase'
import IsLoggedIn from './IsLoggedIn'

class Nav extends Component{
  componentDidMount(){
    //window.$('.sidebar-menu').SidebarNav()

    // var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
    // showLeftPush = document.getElementById( 'showLeftPush' ),
    // body = document.body;
    
    // showLeftPush.onclick = function() {
    //   classie.toggle( this, 'active' );
    //   classie.toggle( body, 'cbp-spmenu-push-toright' );
    //   classie.toggle( menuLeft, 'cbp-spmenu-open' );
    //   disableOther( 'showLeftPush' );
    // };
    
    // function disableOther( button ) {
    //   if( button !== 'showLeftPush' ) {
    //     classie.toggle( showLeftPush, 'disabled' );
    //   }
    // }
  }
  render(){
      return(
        <div className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1">
          <aside className="sidebar-left">
            <nav className="navbar navbar-inverse">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".collapse" aria-expanded="false">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  </button>
                  <h1><NavLink to="/" className="navbar-brand" href="index.html"><span className="fa fa-area-chart"></span> tapamedic.com<span className="dashboard_text">Design dashboard</span></NavLink></h1>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="sidebar-menu">
                    <li className="treeview">
                      <NavLink to="/dashboard" activeStyle={activeStyle} exact>
                        <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                      <NavLink to="/" activeStyle={activeStyle} exact>
                        <i className="fa fa-home"></i> <span>Home</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                      <NavLink to="/dashboard/questions" activeStyle={activeStyle} exact>
                      <i className="fa fa-laptop"></i> <span>Ask a Question</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                      <NavLink to="/dashboard/talk-to-a-doc" activeStyle={activeStyle} exact>
                      <i className="fa fa-pie-chart"></i> <span>Talk to a Doctor</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                      <NavLink to="/dashboard/profile" activeStyle={activeStyle} exact>
                        <i className="fa fa-user"></i> <span>My Profile</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                      <NavLink to="/dashboard/payment" activeStyle={activeStyle} exact>
                        <i className="fa fa-suitcase"></i> <span>Make Payment</span>
                      </NavLink>
                    </li>
                    <li className="treeview">
                    <a onClick={(e) => {
                      e.preventDefault()
                      firebase.auth().signOut()
                    }}>
                        <i className="fa fa-sign-out"></i> <span>Logout</span>
                      </a>
                    </li>
                  </ul>
                </div>
                
            </nav>
          </aside>
        </div>
      )
  }
}

const activeStyle = {
  color: '#fff',
  background: '#1e282c',
  borderLeftColor: '#3c8dbc'
}

export default IsLoggedIn(Nav)
//export default Nav