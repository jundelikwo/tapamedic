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

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
