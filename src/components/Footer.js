import React from 'react';
import { NavLink } from 'react-router-dom'

const Footer = ()=>(
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
)

export default Footer