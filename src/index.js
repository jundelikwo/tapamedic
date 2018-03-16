import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase'
import { createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import reducers from './reducers'
import { login, logout, addRole } from './actions'
import { FirebaseConfig } from './config'
import { b64DecodeUnicode } from './functions'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


try {
    // Initialize firebase
    firebase.initializeApp(FirebaseConfig);
} catch (e){
    
}

// Initialize store
let store = createStore(reducers, {}, compose(
    window.devToolsExtension ? window.devToolsExtension() : f => f
))


let callback = null;
let metadataRef = null;
firebase.auth().onAuthStateChanged(user => {
  // Remove previous listener.
  if (callback) {
    metadataRef.off('value', callback);
  }
  // On user login add new listener.
  if (user) {
    store.dispatch(login(user))
    // Check if refresh is required.
    metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
    callback = (snapshot) => {
      // Force refresh to pick up the latest custom claims changes.
      // Note this is always triggered on first call. Further optimization could be
      // added to avoid the initial trigger when the token is issued and already contains
      // the latest claims.
      user.getIdToken(true).then(idToken => {
        const payload = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]))
        
        store.dispatch(login(user))
        store.dispatch(addRole(payload.role))
      });
    };
    // Subscribe new listener to changes on that node.
    metadataRef.on('value', callback);
  } else {
    store.dispatch(logout())
  }
});

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));
registerServiceWorker();
