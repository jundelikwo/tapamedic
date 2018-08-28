import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import firebase from 'firebase'
import IsLoggedIn from '../IsLoggedIn'

class Header extends Component{
    render(){
        return(
        <div className="sticky-header header-section ">
			<div className="header-left">
				
				
				<button id="showLeftPush" style={{ display: 'none' }}><i className="fa fa-bars"></i></button>
				
				<div className="profile_details_left">
					<ul className="nofitications-dropdown">
						<li className="dropdown head-dpdn">
							<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-envelope"></i><span className="badge">4</span></a>
							<ul className="dropdown-menu">
								<li>
									<div className="notification_header">
										<h3>You have 3 new messages</h3>
									</div>
								</li>
								<li><a>
								   <div className="user_img"><img src="images/1.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet</p>
									<p><span>1 hour ago</span></p>
									</div>
								   <div className="clearfix"></div>	
								</a></li>
								<li className="odd"><a>
									<div className="user_img"><img src="images/4.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet </p>
									<p><span>1 hour ago</span></p>
									</div>
								  <div className="clearfix"></div>	
								</a></li>
								<li><a>
								   <div className="user_img"><img src="images/3.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet </p>
									<p><span>1 hour ago</span></p>
									</div>
								   <div className="clearfix"></div>	
								</a></li>
								<li>
									<div className="notification_bottom">
										<a>See all messages</a>
									</div> 
								</li>
							</ul>
						</li>
						<li className="dropdown head-dpdn">
							<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-bell"></i><span className="badge blue">4</span></a>
							<ul className="dropdown-menu">
								<li>
									<div className="notification_header">
										<h3>You have 3 new notification</h3>
									</div>
								</li>
								<li><a>
									<div className="user_img"><img src="images/4.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet</p>
									<p><span>1 hour ago</span></p>
									</div>
								  <div className="clearfix"></div>	
								 </a></li>
								 <li className="odd"><a>
									<div className="user_img"><img src="images/1.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet </p>
									<p><span>1 hour ago</span></p>
									</div>
								   <div className="clearfix"></div>	
								 </a></li>
								 <li><a>
									<div className="user_img"><img src="images/3.jpg" alt=""/></div>
								   <div className="notification_desc">
									<p>Lorem ipsum dolor amet </p>
									<p><span>1 hour ago</span></p>
									</div>
								   <div className="clearfix"></div>	
								 </a></li>
								 <li>
									<div className="notification_bottom">
										<a>See all notifications</a>
									</div> 
								</li>
							</ul>
						</li>	
						<li className="dropdown head-dpdn">
							<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><i className="fa fa-tasks"></i><span className="badge blue1">8</span></a>
							<ul className="dropdown-menu">
								<li>
									<div className="notification_header">
										<h3>You have 8 pending task</h3>
									</div>
								</li>
								<li><a>
									<div className="task-info">
										<span className="task-desc">Database update</span><span className="percentage">40%</span>
										<div className="clearfix"></div>	
									</div>
									<div className="progress progress-striped active">
										<div className="bar yellow" style={{width: '40%'}}></div>
									</div>
								</a></li>
								<li><a>
									<div className="task-info">
										<span className="task-desc">Dashboard done</span><span className="percentage">90%</span>
									   <div className="clearfix"></div>	
									</div>
									<div className="progress progress-striped active">
										 <div className="bar green" style={{width: '90%'}}></div>
									</div>
								</a></li>
								<li><a>
									<div className="task-info">
										<span className="task-desc">Mobile App</span><span className="percentage">33%</span>
										<div className="clearfix"></div>	
									</div>
								   <div className="progress progress-striped active">
										 <div className="bar red" style={{width: '33%'}}></div>
									</div>
								</a></li>
								<li><a>
									<div className="task-info">
										<span className="task-desc">Issues fixed</span><span className="percentage">80%</span>
									   <div className="clearfix"></div>	
									</div>
									<div className="progress progress-striped active">
										 <div className="bar  blue" style={{width: '80%'}}></div>
									</div>
								</a></li>
								<li>
									<div className="notification_bottom">
										<a>See all pending tasks</a>
									</div> 
								</li>
							</ul>
						</li>
					</ul>
					<div className="mobile-nav">
						<li className="dropdown head-dpdn">
							<NavLink to="/dashboard" activeStyle={activeStyle} exact>
								<span>Dashboard</span>
							</NavLink>
						</li>
						<li className="dropdown head-dpdn">
							<NavLink to="/" activeStyle={activeStyle} exact>
								<span>Home</span>
							</NavLink>
						</li>
						<li className="dropdown head-dpdn">
							<NavLink to="/dashboard/questions" activeStyle={activeStyle} exact>
								<span>Ask a Question</span>
							</NavLink>
						</li>
						<li className="dropdown head-dpdn">
							<NavLink to="/dashboard/talk-to-a-doc" activeStyle={activeStyle} exact>
								<span>Talk to a Doctor</span>
							</NavLink>
						</li>
						<li className="dropdown head-dpdn">
							<NavLink to="/dashboard/profile" activeStyle={activeStyle} exact>
								<span>My Profile</span>
							</NavLink>
						</li>
						<li className="dropdown head-dpdn">
							<NavLink to="/dashboard/payment" activeStyle={activeStyle} exact>
								<span>Make Payment</span>
							</NavLink>
						</li>
					</div>
					<div className="clearfix"> </div>
				</div>
				
				<div className="clearfix"> </div>
			</div>

			<div className="header-right">
				<div className="profile_details">		
					<ul>
						<li className="dropdown profile_details_drop">
							<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
								<div className="profile_img">	
									<span className="prfil-img"><img style={{ height: '50px', width: '50px' }} src={this.props.photoURL} alt=""/> </span> 
									<div className="user-name">
										<p>Hi {this.props.firstName}</p>
										<span>{this.props.lastName}</span>
									</div>
									<i className="fa fa-angle-down lnr"></i>
									<i className="fa fa-angle-up lnr"></i>
									<div className="clearfix"></div>	
								</div>	
							</a>
							<ul className="dropdown-menu drp-mnu">
								<li> <a><i className="fa fa-cog"></i> Settings</a> </li> 
								<li> <a><i className="fa fa-user"></i> My Profile</a> </li>
								<li> <a><i className="fa fa-suitcase"></i> My Wallet</a> </li> 
								<li> <a onClick={(e) => {
									e.preventDefault()
									firebase.auth().signOut()
								}}><i className="fa fa-sign-out"></i> Logout</a> </li>
							</ul>
						</li>
					</ul>
				</div>
				<div className="clearfix"> </div>				
			</div>
			<div className="clearfix"> </div>	
		</div>
        )
    }
}

const activeStyle = {
	color: 'green'
}

const mapStateToProps = (state) => {
	let name = state.user.name || 'Anonymous'
	let spaceChar = name.lastIndexOf(' ')
	let firstName = ''
	let lastName = ''
	if(spaceChar !== -1 ){
		firstName = name.slice(0,spaceChar)
		lastName = name.slice(spaceChar+1)
	}else{
		firstName = name;
	}
	return {
		firstName,
		lastName,
		photoURL: state.user.photoURL
	}
}

export default IsLoggedIn(connect(mapStateToProps, null, null, { pure: false })(Header))
//export default Header