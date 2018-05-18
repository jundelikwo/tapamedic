const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tapamedic-7a09f.firebaseio.com"
});

const paystackKey = functions.config().paystack.key
var paystack = require('paystack')(paystackKey);
var request = require('request');

const gcs = require('@google-cloud/storage')({keyFilename: 'service-account.json'});
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.setUserRole = functions.auth.user().onCreate(user => {
    //var user = event.data
    var time = new Date().getTime()
    
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
        if(databaseNode === "doctors/"){
            admin.database().ref(databaseNode + user.uid).update({ approved: false, memberSince: time })
        }else{
            admin.database().ref(databaseNode + user.uid).set({memberSince: time})
        }
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

exports.verifyPaystack = functions.database.ref('/patients/{uid}/payment').onWrite((change, context) => {
    const val = change.after.val();
    console.log('verifyPaystack change',change,'context: ',context)
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
            if(id !== context.auth.token.phone_number){
                return;
            }
            paystackId = customer.id

            return admin.database().ref(`/patients/${context.params.uid}/paystack/paymentHistory`).orderByValue().equalTo(reference).once('value').then((snapshot) => {
                if(!snapshot.val()){
                    return admin.database().ref(`/patients/${context.params.uid}/profile/wallet`).once('value').then((snapshot) => {
                        wallet = snapshot.val()
                        data = {
                            'payment': null,
                            'paystack/id': paystackId,
                            'profile/wallet': wallet + (amount / 100)
                        }
                        admin.database().ref(`/patients/${context.params.uid}/paystack/paymentHistory/`).push(reference)
                        return admin.database().ref(`/patients/${context.params.uid}`).update(data)
                    })
                }else{
                    return;
                }
              })
        }
    })
})

exports.resizePicture = functions.storage.object().onFinalize((object) => {
    
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metadata = object.metadata
    
    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }
    
    // Get the file name.
    const fileName = path.basename(filePath);

    if (metadata.isResized) {
        console.log('Exiting: Already been resized')
        return null
    }

    const uid = filePath.substr(filePath.indexOf('/')+1,filePath.lastIndexOf('/profile')-filePath.indexOf('/')-1)
    console.log('uid',uid)
    const role = filePath.substr(0,filePath.indexOf('/'))
    console.log('role',role)

    // Download file from bucket.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const JPGFileName = 'profile.JPG'
    const JPGFilePath = path.join(os.tmpdir(), JPGFileName)
    const options = {
        contentType: contentType,
        isResized: true
    };
    const file = bucket.file(filePath)
    const thumbFilePath = path.join(path.dirname(filePath), JPGFileName);

    return file.download({
        destination: tempFilePath,
    }).then(() => {
        console.log('Image downloaded locally to', tempFilePath);
        // Resize image using ImageMagick.
        return spawn('convert', [tempFilePath, '-resize', '200x200>', JPGFilePath]);
    }).then(() => {
        console.log('Resized image created at', tempFilePath);
        console.log('thumbFilePath at', thumbFilePath);
        return bucket.upload(JPGFilePath, {
            destination: thumbFilePath,
            metadata: { metadata: options }
        });
        // Once the thumbnail has been uploaded delete the local file to free up disk space.
    }).then((test) => {
        if(fileName !== JPGFileName){
            file.delete().then(() => {
                console.log(`Successfully deleted photo`)
                return;
            }).catch(err => {
                console.log(`Failed to remove photo, error: ${err}`)
                return;
            });
        }
        fs.unlinkSync(tempFilePath)

        return bucket.file(thumbFilePath).getSignedUrl({
            action: 'read',
            expires: '03-09-2491'
          }).then(signedUrls => {
              // signedUrls[0] contains the file's public URL
              console.log('signedUrls[0]',signedUrls[0])
              console.log('Test',test)
              console.log('metadata',metadata)
              return admin.database().ref(`${role}/${uid}/profile/`).update({photo: signedUrls[0]})
          });
    });
});