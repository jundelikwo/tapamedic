import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import firebase from 'firebase'

class Nav extends Component{
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
                      {/* <li className="header">MAIN NAVIGATION</li> */}
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
                        <a href="#">
                        <i className="fa fa-laptop"></i> <span>Questions</span>
                        <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                          <li><a href="grids.html"><i className="fa fa-angle-right"></i> My Questions</a></li>
                          <li><a href="media.html"><i className="fa fa-angle-right"></i> All Questions</a></li>
                        </ul>
                      </li>
                      <li className="treeview">
                        <a href="charts.html">
                        <i className="fa fa-pie-chart"></i> <span>Search for a Doctor</span>
                        </a>
                      </li>
                      <li className="treeview">
                        <a href="#">
                        <i className="fa fa-laptop"></i> <span>Consultations</span>
                        <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                          <li><a href="general.html"><i className="fa fa-angle-right"></i> All Consultations</a></li>
                          <li><a href="icons.html"><i className="fa fa-angle-right"></i> Start a Consultation</a></li>
                        </ul>
                      </li>
                      <li className="treeview">
                        <a href="#">
                        <i className="fa fa-envelope"></i> <span>Complaints</span>
                        <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                          <li><a href="tables.html"><i className="fa fa-angle-right"></i> My Complaints</a></li>
                          <li><a href="tables.html"><i className="fa fa-angle-right"></i> Make a Complaints</a></li>
                        </ul>
                      </li>
                      <li className="header">User</li>
                      <li className="treeview">
                        <a href="#">
                        <i className="fa fa-user"></i> <span>My Profile</span>
                        <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                          <li><a href="forms.html"><i className="fa fa-angle-right"></i> View Profile</a></li>
                          <li><a href="validation.html"><i className="fa fa-angle-right"></i> Edit Profile</a></li>
                        </ul>
                      </li>
                      <li className="treeview">
                        <a href="#">
                        <i className="fa fa-suitcase"></i> <span>My Wallet</span>
                        <i className="fa fa-angle-left pull-right"></i>
                        </a>
                        <ul className="treeview-menu">
                          <li><a href="tables.html"><i className="fa fa-angle-right"></i> Make Payment</a></li>
                        </ul>
                      </li>
                      <li className="treeview">
                      <a onClick={(e) => {
                        e.preventDefault()
                        firebase.auth().signOut()
                      }}>
                          <i className="fa fa-sign-out"></i> <span>Logout</span>
                        </a>
                      </li>
                      {/* <li className="header">LABELS</li>
                      <li><a href="#"><i className="fa fa-angle-right text-red"></i> <span>Important</span></a></li>
                      <li><a href="#"><i className="fa fa-angle-right text-yellow"></i> <span>Warning</span></a></li>
                      <li><a href="#"><i className="fa fa-angle-right text-aqua"></i> <span>Information</span></a></li> */}
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

export default Nav