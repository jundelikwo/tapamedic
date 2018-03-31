const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

var paystack = require('paystack')(functions.config().paystack.key);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.setUserRole = functions.auth.user().onCreate((event) =>{
    var user = event.data
    
    var customClaims;
    var databaseNode;
    if(user.phoneNumber){
        customClaims = {
            role: 'patient'
        };
        databaseNode = "patients/"
    }else if(user.email){
        customClaims = {
            role: 'doctor'
        };
        databaseNode = "doctors/"
    }
    // Set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims)
    .then(() => {
        var time = new Date().getTime()
        admin.database().ref(databaseNode + user.uid).set({memberSince: time})
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref("metadata/" + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({refreshTime: time});
    })
    .catch(error => {
        console.log(error);
    });
})

exports.verifyPaystack = functions.database.ref('/patients/{uid}/payment').onWrite(event => {
    const val = event.data.val();
    console.log('Value',val)
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the API returned a result (id exists)
    if (val === null || val.id || val.error) return null;

    paystack.transaction.verify(val.reference,function(error, body){
        console.log('Error',error)
        console.log('Body',body)
    })

    return admin.database().ref(`/patients/${event.params.userId}/payment`).once('value').then((snapshot) => {
        return snapshot.val();
      })
})