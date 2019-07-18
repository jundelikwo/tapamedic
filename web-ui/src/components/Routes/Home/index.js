import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import firebase from 'firebase'

import { goOffline } from '../../../actions/'

import './index.css'

let originalPageFontSize;

class Home extends Component{
    componentDidMount(){
        const $ = window.$
        let htmlElem = $('html')
        new window.WOW().init();
        //$().UItoTop({ easingType: 'easeOutQuart' });
        $("span.menu").click(function(){
            $(".top-menu ul").slideToggle("slow" , function(){
            });
        });
        $("#slider2").responsiveSlides({
            auto: true,
            pager: true,
            speed: 300,
            namespace: "callbacks",
        });
        $(".scroll").click(function(event){		
            event.preventDefault();
            $('html,body').animate({scrollTop:$(this.hash).offset().top},900);
        });
        originalPageFontSize = htmlElem.css('font-size')
        htmlElem.css('font-size','13.5px')
    }

    componentWillUnmount(){
        const $ = window.$
        $('html').css('font-size',originalPageFontSize)
        //$('#toTop').css('display', 'none')
    }

    renderHeader = () => {
        const { isLoggedIn } = this.props
        let authNavText = 'Sign In | Sign Up'
        let authNavPath = '/login'
        if(isLoggedIn){
            authNavText = 'My Profile'
            authNavPath = '/dashboard/profile'
        }

        return (
            <div className="header home">
                <div className="logo wow fadeInLeft" data-wow-delay="0.5s" style={{ height: 50, overflowY: "hidden"}}>
                    <NavLink to='/'><img src="/images/logoLG.svg" alt="" style={{width: 220}}/></NavLink>
                </div>
                <div className="top-menu">
                <span className="menu"></span>
                    <ul>
                        <li className="active"><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/dashboard/talk-to-a-doc'>Talk to a Doctor</NavLink></li>
                        <li><NavLink to='/dashboard/questions'>Ask a Question</NavLink></li>
                        {/* <li><a className="scroll" href="#about">About</a></li>
                        <li><a className="scroll" href="#testimonials">Testimonials</a></li>
                        <li><a className="scroll" href="#contact">Contact</a></li> */}
                        <li><NavLink to={authNavPath}>{authNavText}</NavLink></li> 
                        {!isLoggedIn ? null : (
                            <li> <a onClick={(e) => {
                                e.preventDefault()
                                this.props.dispatch(goOffline())
                                firebase.auth().signOut()
                            }}>Logout</a> </li>
                        )}
                    </ul>
                </div>  	

                <div className="clearfix"/>
            </div>
        )
    }

    render(){
        const { isLoggedIn } = this.props
        let authNavText = 'Sign In | Sign Up'
        let authNavPath = '/login'
        if(isLoggedIn){
            authNavText = 'My Profile'
            authNavPath = '/dashboard/profile'
        }

        return(
            <div>
                <div className="banner">
                    <div className="container">
                        {this.renderHeader()}
                        {this.renderHeader()}
                        <div className="banner-info">
                            <div className="col-md-6 banner-text wow fadeInRight" data-wow-delay="0.5s">
                                <h3>introducing tap a medic</h3>
                                <h1>Quality & Affordable healthcare without stress</h1>
                                <NavLink className="download" to={authNavPath}>{authNavText.toUpperCase()}</NavLink>
                                <a className="scroll view hvr-bounce-to-left" href="#features">VIEW FEATURES</a>
                            </div>
                            <div className="col-md-6 banner-pic wow fadeInLeft" data-wow-delay="0.5s">
                                <img src="/images/phn.png" alt=""/>
                            </div>
                            <div className="clearfix"/>
                        </div>
                    </div>
                </div>
                <div id="features" className="features">
                    <div className="container">
                        <div className="features-head">
                            <h4>PRODUCT OVERVIEW</h4>
                            <h3>Amazing Features</h3>			 
                        </div>
                        <div className="features-section">
                            <div className="col-md-3 feature-grid">
                                <img className="wow bounceIn" data-wow-delay="0.4s" src="/images/icon1.png" alt=""/>
                                <h3>Affordable</h3>
                                <p>Quality healthcare is now affordable with tapamedic. For as low as &#8358;600 naira, you can have a video, voice, image or text chat with one off our qualified doctor immediately</p>
                                <NavLink className="btn btn-primary" to='/dashboard/talk-to-a-doc'>Try it now</NavLink>
                            </div>
                            <div className="col-md-3 feature-grid">
                                <img className="wow bounceIn" data-wow-delay="0.4s" src="/images/question.png" alt=""/>
                                <h3>Free Questions</h3>
                                <p>Once you sign up. You can ask unlimited health related questions free off charge.</p>
                                <NavLink className="btn btn-primary" to='/dashboard/question'>Ask now</NavLink>
                            </div>
                            <div className="col-md-3 feature-grid">
                                <img className="wow bounceIn" data-wow-delay="0.4s" src="/images/verified.png" alt=""/>
                                <h3>Verified Doctors</h3>
                                <p>All our doctors have been verified to be licensed by the Medical and dental council of Nigeria (MDCN) and members of The Nigeian medical association (NMA)</p>
                                <NavLink className="btn btn-primary" to='/dashboard/talk-to-a-doc'>Talk to a Dr now</NavLink>
                            </div>
                            <div className="col-md-3 feature-grid">
                                <img className="wow bounceIn" data-wow-delay="0.4s" src="/images/verified.png" alt=""/>
                                <h3>Multiple Languages</h3>
                                <p>You can even talk to our doctors using your local dialect</p>
                            </div>
                            <div className="clearfix"/>
                        </div>
                    </div>
                </div>
                <div id="about" className="about">
                    <div className="container">
                        <div className="about-top">
                            <div className="col-md-6 about-device wow fadeInLeft" data-wow-delay="0.5s">
                                <img src="/images/phn2.png" alt=""/>
                            </div>
                            <div className="col-md-6 about-device-info wow fadeInRight" data-wow-delay="0.5s">
                                <div className="device-text">
                                    <h4>AS A Patient</h4>
                                    <h3>Get Access to qualified doctors just a tap away</h3>					 
                                    <p>Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit.
                                    Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit. </p>
                                </div>
                                <div className="about-list">
                                    <ul>
                                        <li><a href="#"><span className="abt1"></span>Just Register</a></li>
                                        <li><a href="#"><span className="abt2"></span>Fill out your profile to help our doctors serve you better</a></li>
                                        <li><a href="#"><span className="abt3"></span>Ask unlimited health questions at &#8358;0.00</a></li>
                                        <li><a href="#"><span className="abt3"></span>View Answers to unlimited health questions at &#8358;0.00</a></li>
                                        <li><a href="#"><span className="abt4"></span>Have a private video, voice or text consultation with one of our many qualified doctors for as low as &#8358;600.00 </a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="clearfix"/>
                        </div>		
                    </div>
                </div>
                <div className="about-bottom">
                    <div className="container">
                        <div className="col-md-6 about-customize wow fadeInRight" data-wow-delay="0.5s">
                            <div className="device-text-bottom">
                                    <h4>AS A DOCTOR</h4>
                                    <h3>Reach more people and earn money while doing so</h3>						
                                    <p>Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. 
                                    Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
                            </div>		
                            <div className="about-list">
                                <ul>
                                    <li><a href="#"><span className="abt1"></span>Just Register</a></li>
                                    <li><a href="#"><span className="abt2"></span>Fill out your profile</a></li>
                                    <li><a href="#"><span className="abt3"></span>Once profile is complete, await profile verification</a></li>
                                    <li><a href="#"><span className="abt3"></span>Answer our patients health questions</a></li>
                                    <li><a href="#"><span className="abt4"></span>Earn money from consultations</a></li>
                                </ul>
                            </div>		 
                        </div>
                        <div className="col-md-6 about-device-bottom wow fadeInLeft" data-wow-delay="0.5s">
                            <img src="/images/phn3.jpg" alt=""/>
                        </div>
                        <div className="clearfix"/>
                    </div>
                </div>
                <div id="testimonials" className="pricing">
                    <div className="container">
                        <div className="pricing-text">
                            <h4>QUALITY HAS ITS PRICE</h4>
                            <h3>Testimonials</h3>				
                        </div>
                        <div className="pricing-grids">
                            <div className="slider">
                                <ul className="rslides" id="slider2">
                                    <li>						 
                                        <div className="col-md-6 pricing-plans">
                                            <p>Once upon a time all the Rivers combined to protest against the action of the Sea in making their waters salt.
                                            “When we come to you,” said they to the Sea.</p>
                                            <div className="pic1">
                                                <img src="/images/pr1.png" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        <div className="col-md-6 pricing-plans">
                                            <p>A shoe is not only a design, but it's a part of your body language, the way you walk. The way you're going to move is quite dictated by your shoes.</p>
                                            <div className="pic1">
                                                <img src="/images/pr2.png" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>						
                                        <div className="clearfix"/>						  
                                    </li>	
                                    <li>						    
                                        <div className="col-md-6 pricing-plans">
                                            <p>A shoe is not only a design, but it's a part of your body language, the way you walk. The way you're going to move is quite dictated by your shoes.</p>
                                            <div className="pic1">
                                                <img src="/images/pr2.png" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>	
                                        <div className="col-md-6 pricing-plans">
                                            <p>Once upon a time all the Rivers combined to protest against the action of the Sea in making their waters salt.
                                            “When we come to you,” said they to the Sea.</p>
                                            <div className="pic1">
                                                <img src="/images/m2.jpg" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        <div className="clearfix"/>						  
                                    </li>
                                    <li>						 
                                        <div className="col-md-6 pricing-plans">
                                            <p>Once upon a time all the Rivers combined to protest against the action of the Sea in making their waters salt.
                                            “When we come to you,” said they to the Sea.</p>
                                            <div className="pic1">
                                                <img src="/images/m1.jpg" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        <div className="col-md-6 pricing-plans">
                                            <p>A shoe is not only a design, but it's a part of your body language, the way you walk. The way you're going to move is quite dictated by your shoes.</p>
                                            <div className="pic1">
                                                <img src="/images/pr1.png" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>						
                                        <div className="clearfix"/>						  
                                    </li>	
                                    <li>						    
                                        <div className="col-md-6 pricing-plans">
                                            <p>A shoe is not only a design, but it's a part of your body language, the way you walk. The way you're going to move is quite dictated by your shoes.</p>
                                            <div className="pic1">
                                                <img src="/images/pr2.png" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>	
                                        <div className="col-md-6 pricing-plans">
                                            <p>Once upon a time all the Rivers combined to protest against the action of the Sea in making their waters salt.
                                            “When we come to you,” said they to the Sea.</p>
                                            <div className="pic1">
                                                <img src="/images/m2.jpg" alt=""/>
                                            </div>
                                            <div className="pic-info">
                                                    <h5>John Doe</h5>
                                                    <a href="#">CEO, THE RIVERS COMPANY</a>
                                            </div>
                                            <div className="clearfix"/>
                                        </div>
                                        <div className="clearfix"/>						  
                                    </li>
                                </ul>
                            </div>
                        </div>  	
                    </div>
                </div>
                <div className="theme">
                    <div className="container">
                        <h3 className="wow bounceIn" data-wow-delay="0.4s"><span>Like what you see ?</span> Get started now !</h3>
                        <a className="view hvr-bounce-to-left wow bounceIn" data-wow-delay="0.4s" href="#">VIEW FEATURES</a>
                        <NavLink className="download wow bounceIn" to={authNavPath}>{authNavText.toUpperCase()}</NavLink>	 
                    </div>
                </div>
                <div id="contact" className="contact">
                    <div className="container">
                        <div className="contact-text">
                        <h4>STAY IN TOUCH</h4>
                        <h3>Contact us</h3>			
                        </div>
                        <div className="contact-grids">
                            <div className="col-md-4 contact-grid text-center wow bounceIn" data-wow-delay="0.4s">
                                <div className="icon1"></div>
                                <p>Phone: (415) 124-5678</p>
                                <p>Fax: (412) 123-8290</p>
                            </div>
                            <div className="col-md-4 contact-grid text-center wow bounceIn" data-wow-delay="0.4s">
                                <div className="icon2"></div>
                                <p>1001 Brickell Bay Dr.</p>
                                <p>Suite 1900</p>
                                <p>Miami, FL 33131</p>
                            </div>
                            <div className="col-md-4 contact-grid text-center wow bounceIn" data-wow-delay="0.4s">
                                <div className="icon3"></div>
                                <a href="mailto:example.com">support@yourname.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer text-center" id="footer-home">
                    <div className="container">
                        <div className="social">			 
                            <a href="#"><span className="behance"></span></a>
                            <a href="#"><span className="dribble"></span></a>
                            <a href="#"><span className="twitter"></span></a>
                            <a href="#"><span className="facebook"></span></a>
                            <a href="#"><span className="NavLinkedin"></span></a>
                        </div>
                        <p className="wow bounceIn" data-wow-delay="0.4s">Copyright &copy; 2018 TAPAMEDIC All rights reserved</p>
                    </div>
                </div>
                {/* <a href="#to-top" id="toTop" style={{display: "block"}}> <span id="toTopHover" style={{opacity: 1}}> </span></a> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.uid
    }
}

export default connect(mapStateToProps)(Home)