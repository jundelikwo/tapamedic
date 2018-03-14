import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase'
import { FirebaseConfig } from './config'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


try {
    // Initialize firebase
    firebase.initializeApp(FirebaseConfig);
} catch (e){
    
}

let callback = null;
let metadataRef = null;
firebase.auth().onAuthStateChanged(user => {
  // Remove previous listener.
  if (callback) {
    metadataRef.off('value', callback);
  }
  // On user login add new listener.
  if (user) {
    // Check if refresh is required.
    metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
    callback = (snapshot) => {
      // Force refresh to pick up the latest custom claims changes.
      // Note this is always triggered on first call. Further optimization could be
      // added to avoid the initial trigger when the token is issued and already contains
      // the latest claims.
      user.getIdToken(true).then(idToken => {
        
        const payload = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]))
    
        console.log('payload',payload);
      });
    };
    // Subscribe new listener to changes on that node.
    metadataRef.on('value', callback);
  }
});
function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();
        if (code.length < 2) {
            code = '0' + code;
        }
        return '%' + code;
    }));
}

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
