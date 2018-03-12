import React, { Component } from 'react';
import Header from '../Header'
import Main from '../Main'
import Nav from '../Nav'
import Footer from '../Footer'

class Dashboard extends Component{
    componentDidMount(){
      window.$('.sidebar-menu').SidebarNav()
  
      var menuLeft = document.getElementById( 'cbp-spmenu-s1' ),
      showLeftPush = document.getElementById( 'showLeftPush' ),
      body = document.body;
      
      showLeftPush.onclick = function() {
        window.classie.toggle( this, 'active' );
        window.classie.toggle( body, 'cbp-spmenu-push-toright' );
        window.classie.toggle( menuLeft, 'cbp-spmenu-open' );
        disableOther( 'showLeftPush' );
      };
      
      function disableOther( button ) {
        if( button !== 'showLeftPush' ) {
          window.classie.toggle( showLeftPush, 'disabled' );
        }
      }
    }
    render(){
        return (    
            <div>
                <Nav/>
                <Header/>
                <Main/>
                <Footer/>
            </div>
        )
    }
}

export default Dashboard