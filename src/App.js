import React, { Component } from 'react';
import Header from './components/Header'
import Main from './components/Main'
import Nav from './components/Nav'
import Footer from './components/Footer'

class App extends Component {
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
  render() {
    return (
      <div>
        <Nav/>
        <Header/>
        <Main/>
        <Footer/>
      </div>
    );
  }
}

export default App;
