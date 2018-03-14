import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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
                <h1><Link to="/" className="navbar-brand" href="index.html"><span className="fa fa-area-chart"></span> tapamedic.com<span className="dashboard_text">Design dashboard</span></Link></h1>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul className="sidebar-menu">
                  <li className="header">MAIN NAVIGATION</li>
                  <li className="treeview">
                    <a href="index.html">
                    <i className="fa fa-dashboard"></i> <span>Dashboard</span>
                    </a>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-laptop"></i>
                    <span>Components</span>
                    <i className="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul className="treeview-menu">
                      <li><a href="grids.html"><i className="fa fa-angle-right"></i> Grids</a></li>
                      <li><a href="media.html"><i className="fa fa-angle-right"></i> Media Css</a></li>
                    </ul>
                  </li>
                  <li className="treeview">
                    <a href="charts.html">
                    <i className="fa fa-pie-chart"></i>
                    <span>Charts</span>
                    <span className="label label-primary pull-right">new</span>
                    </a>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-laptop"></i>
                    <span>UI Elements</span>
                    <i className="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul className="treeview-menu">
                      <li><a href="general.html"><i className="fa fa-angle-right"></i> General</a></li>
                      <li><a href="icons.html"><i className="fa fa-angle-right"></i> Icons</a></li>
                      <li><a href="buttons.html"><i className="fa fa-angle-right"></i> Buttons</a></li>
                      <li><a href="typography.html"><i className="fa fa-angle-right"></i> Typography</a></li>
                    </ul>
                  </li>
                  <li>
                    <a href="widgets.html">
                    <i className="fa fa-th"></i> <span>Widgets</span>
                    <small className="label pull-right label-info">08</small>
                    </a>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-edit"></i> <span>Forms</span>
                    <i className="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul className="treeview-menu">
                      <li><a href="forms.html"><i className="fa fa-angle-right"></i> General Forms</a></li>
                      <li><a href="validation.html"><i className="fa fa-angle-right"></i> Form Validations</a></li>
                    </ul>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-table"></i> <span>Tables</span>
                    <i className="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul className="treeview-menu">
                      <li><a href="tables.html"><i className="fa fa-angle-right"></i> Simple tables</a></li>
                    </ul>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-envelope"></i> <span>Mailbox</span>
                    <i className="fa fa-angle-left pull-right"></i><small className="label pull-right label-info1">08</small><span className="label label-primary1 pull-right">02</span></a>
                    <ul className="treeview-menu">
                      <li><a href="inbox.html"><i className="fa fa-angle-right"></i> Mail Inbox</a></li>
                      <li><a href="compose.html"><i className="fa fa-angle-right"></i> Compose Mail </a></li>
                    </ul>
                  </li>
                  <li className="treeview">
                    <a href="#">
                    <i className="fa fa-folder"></i> <span>Examples</span>
                    <i className="fa fa-angle-left pull-right"></i>
                    </a>
                    <ul className="treeview-menu">
                      <li><a href="login.html"><i className="fa fa-angle-right"></i> Login</a></li>
                      <li><a href="signup.html"><i className="fa fa-angle-right"></i> Register</a></li>
                      <li><a href="404.html"><i className="fa fa-angle-right"></i> 404 Error</a></li>
                      <li><a href="500.html"><i className="fa fa-angle-right"></i> 500 Error</a></li>
                      <li><a href="blank-page.html"><i className="fa fa-angle-right"></i> Blank Page</a></li>
                    </ul>
                  </li>
                  <li className="header">LABELS</li>
                  <li><a href="#"><i className="fa fa-angle-right text-red"></i> <span>Important</span></a></li>
                  <li><a href="#"><i className="fa fa-angle-right text-yellow"></i> <span>Warning</span></a></li>
                  <li><a href="#"><i className="fa fa-angle-right text-aqua"></i> <span>Information</span></a></li>
                </ul>
              </div>
              
          </nav>
        </aside>
        </div>
        )
    }
}

export default Nav