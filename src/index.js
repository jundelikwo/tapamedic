import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase'
import { applyMiddleware, createStore, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import { login, logout, addRole, startAddProfileData, startAddSupportedLanguages } from './actions'
import { FirebaseConfig } from './config'
import { b64DecodeUnicode } from './functions'
import './index.css';
import App from './App';
//import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker';


try {
  // Initialize firebase
  firebase.initializeApp(FirebaseConfig);
} catch (e){
    
}

// Initialize store
let store = createStore(reducers, {}, compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

store.dispatch(startAddSupportedLanguages())

let callback = null;
let metadataRef = null;
firebase.auth().onAuthStateChanged(user => {
  // Remove previous listener.
  if (callback) {
    metadataRef.off('value', callback);
  }
  // On user login add new listener.
  if (user) {
    firebase.database().goOnline();
    console.log('User',user)
    store.dispatch(login(user))

    let payload1 = {}
    let profileDataRef  = null
    user.getIdTokenResult().then((idTokenResult) => {
      console.log('idTokenResult',idTokenResult)
      payload1.role = idTokenResult.claims.role

      if(payload1.role){
        store.dispatch(addRole(payload1.role))
        if(user){
          profileDataRef = store.dispatch(startAddProfileData())
          console.log('profileDataRef',profileDataRef)
        }
      }
    })
    
    // Check if refresh is required.
    metadataRef = firebase.database().ref('metadata/' + user.uid + '/refreshTime');
    callback = (snapshot) => {
      // Force refresh to pick up the latest custom claims changes.
      // Note this is always triggered on first call. Further optimization could be
      // added to avoid the initial trigger when the token is issued and already contains
      // the latest claims.
      user.getIdToken(true).then(() => {
        user.getIdTokenResult().then((idTokenResult) => {
          console.log('idTokenResult',idTokenResult)
          const payload = idTokenResult.claims.role
    
          if(payload !== payload1.role){
            // store.dispatch(login(user))
            if(profileDataRef){profileDataRef.off()}
            store.dispatch(addRole(payload))
            store.dispatch(startAddProfileData())
          }
        })
      })
    };
    // Subscribe new listener to changes on that node.
    metadataRef.on('value', callback);
  } else {
    store.dispatch(logout())
    firebase.database().goOffline();
  }
});

ReactDOM.render((
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
), document.getElementById('root'));
//registerServiceWorker();
unregister()