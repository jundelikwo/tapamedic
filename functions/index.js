const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const paystackKey = functions.config().paystack.key
var paystack = require('paystack')(paystackKey);
var request = require('request');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.setUserRole = functions.auth.user().onCreate((event) =>{
    var user = event.data
    var time = new Date().getTime()
    
    var customClaims;
    var databaseNode;
    if(user.phoneNumber){
        customClaims = {
            role: 'patient'
        };
        databaseNode = "patients/"

        // const paystackOptions = {
        //     url: "https://api.paystack.co/customer",
        //     headers: {
        //       'Authorization': 'Bearer ' + paystackKey,
        //       'Content-Type': 'application/json'
        //     },
        //     form: {
        //         "email": user.phoneNumber + '@payments.tapamedic.com',
        //         "phone": user.phoneNumber,
        //         metadata: {
        //             "role": "Patient"
        //         }
        //     }
        // }
        // request.post(paystackOptions,(error, response, body) => {
        //     console.log('Error',error)
        //     console.log('Body',body)
        //     if (!error && response.statusCode === 200) {
        //       var id = JSON.parse(body).data.id;
        //       admin.database().ref(databaseNode + user.uid + '/paystack').set({ id })
        //     }
        // })
    }else if(user.email){
        customClaims = {
            role: 'doctor'
        };
        databaseNode = "doctors/"
    }
    // Set custom user claims on this newly created user.
    return admin.auth().setCustomUserClaims(user.uid, customClaims)
    .then(() => {
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
    // const uid = event.params.uid
    // const phoneNumber = event.auth.variable['phone_number']
    // console.log('event',event)
    // console.log('event.auth',event.auth)
    // console.log('event.auth.variable',event.auth.variable['phone_number'])
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the API returned a result (id exists)
    if (val === null || val.id || val.error) return null;

    return paystack.transaction.verify(val.reference,(error, body)=>{
        console.log('Error',error)
        console.log('Body',body)
        if( !error && body.status ){
            const { amount, reference, customer } = body.data
            id = customer.email.substring(0,customer.email.lastIndexOf('@'))
            if(id !== event.auth.variable['phone_number']){
                return;
            }
            paystackId = customer.id

            return admin.database().ref(`/patients/${event.params.uid}/paystack/paymentHistory/${reference}`).once('value').then((snapshot) => {
                if(!snapshot.val()){
                    return admin.database().ref(`/patients/${event.params.uid}/profile/wallet`).once('value').then((snapshot) => {
                        wallet = snapshot.val()
                        data = {
                            'payment': null,
                            'paystack/id': paystackId,
                            'profile/wallet': wallet + (amount / 100)
                        }
                        data['paystack/paymentHistory/' + reference] = true
                        return admin.database().ref(`/patients/${event.params.uid}`).update(data)
                    })
                }else{
                    return;
                }
              })
        }
    })
})