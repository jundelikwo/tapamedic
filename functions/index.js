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
            role: 'doctor',
            approved: false,
            review: false
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
                return null;
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
                    return null;
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

    if (metadata.isResized) {
        console.log('Exiting: Already been resized')
        return null
    }
    
    if(filePath.indexOf('/profile.') !== -1){
        console.log("Yeah I'm a profile image")
        return photoFunc(object,'profile','200x200>','profile',"photo")
    }else if(filePath.indexOf('/mdcnPhoto.') !== -1){
        console.log("Yeah I'm a mdcnPhoto image")
        return photoFunc(object,'mdcnPhoto','200x200>','profile','mdcnPhoto')
    }
    return null
});

function photoFunc(object,nameOfFile,resizedImgSize,photoPath,dbName){

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metadata = object.metadata

    // Get the file name.
    const fileName = path.basename(filePath);
    
    console.log('filePath',filePath)
    const uid = filePath.substr(filePath.indexOf('/')+1,filePath.lastIndexOf('/'+nameOfFile)-filePath.indexOf('/')-1)
    console.log('uid',uid)
    const role = filePath.substr(0,filePath.indexOf('/'))
    console.log('role',role)

    // Download file from bucket.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const JPGFileName = nameOfFile+'.JPG'
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
		return spawn('convert', [tempFilePath, '-resize', resizedImgSize, '-channel', 'RGBA', '-blur', '0x24',  JPGFilePath]);
        //return spawn('convert', [tempFilePath, '-resize', resizedImgSize, JPGFilePath]);
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
                return null;
            }).catch(err => {
                console.log(`Failed to remove photo, error: ${err}`)
                return null;
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
                return admin.database().ref(`${role}/${uid}/${photoPath}/`).update({[dbName]: signedUrls[0]})
            });
    });
}

exports.shouldReviewDoctor = functions.database.ref('/doctors/{uid}/profile').onWrite((change, context) => {
    const { data, languages, location, mdcnPhoto, photo } = change.after.val()
    const uid = context.params.uid

    if(notEmpty(location) && notEmpty(mdcnPhoto) && notEmpty(photo) && data instanceof Object && languages instanceof Object && languages !== {}){
        const { firstName, graduation, lastName, mdcn_folio, mdcn_membership, specialty, university } = data
        console.log('Passed stage 1')
        if(notEmpty(firstName) && notEmpty(graduation) && notEmpty(lastName) && notEmpty(mdcn_folio) && notEmpty(mdcn_membership) && notEmpty(specialty) && notEmpty(university)){
            console.log('Passed stage 2')
            return admin.database().ref(`/doctors/${uid}/review`).once('value').then(snapshot => {
                console.log('Snapshot review',snapshot.val())
                if(!snapshot.val()){
                    return admin.database().ref(`/doctors/${uid}/approved`).once('value').then(snap => {
                        console.log('Snapshot approved',snap.val())
                        if(!snap.val()){
                            return admin.auth().setCustomUserClaims(uid, { review: true, approved: false, role: 'doctor' }).then(() => {
                                admin.database().ref(`metadata/${uid}`).update({ refreshTime:  new Date().getTime() })
                                return admin.database().ref(`/doctors/${uid}/`).update({ review: true })
                            })
                        }
                        return null;
                    })
                }
                return null;
            })
        }
        return null;
    }else{
        console.log('Failed stage 1')
        return null;
    }
})

function notEmpty(input){
    if(typeof input === 'string'){
        const val = input.trim()
        return Boolean(val.length)
    }else{
        return null;
    }
}

exports.shouldApproveDoctor = functions.database.ref('/doctors/{uid}/approved').onWrite((change, context) => {
    const uid = context.params.uid
    const approved = change.after.val()
    if(approved){
        return admin.auth().setCustomUserClaims(uid, { review: false, approved: true, role: 'doctor' }).then(() => {
            console.log('approved')
            admin.database().ref(`metadata/${uid}`).update({ refreshTime:  new Date().getTime() })
            return admin.database().ref(`/doctors/${uid}/`).update({ approved: true, review: false })
        })
    }
    return null;
})

exports.onAskQuestion = functions.database.ref('patients/{uid}/questions/{questionId}').onCreate((snapshot, context) => {
    const { uid, questionId } = context.params
    const { language, text } = snapshot.val()
    const time = new Date().getTime()
    const slug = text.toLowerCase().replace(/ /g,'-') + '-' + time
    let questionRef = admin.database().ref('questions').push({
        language,
        text,
        patientId: uid,
        questionId,
        answered: false,
        answers: 0,
        slug
    })
    return questionRef.then(() => {
        return admin.database().ref(`patients/${uid}/questions/${questionId}`).update({ questionId: questionRef.key, answers: 0 }).then(() => {
            return admin.database().ref(`answers/${questionRef.key}`).set({ slug, answersCount: 0, text })
        })
    })
})

exports.onCreateNewAnswer = functions.database.ref('answers/{questionId}/answers/{uid}').onCreate((snapshot, context) => {
    const { uid, questionId } = context.params
    const { text } = snapshot.val()
    const user = context.auth
    const answerMeta = {
        name: user.token.name,
        photo: user.token.picture
    }

    console.log('answerMeta',answerMeta)
    
    return admin.database().ref(`doctors/${uid}/answers/${questionId}`).update({ text }).then(() => {
        return admin.database().ref(`answers/${questionId}/answersCount`).once('value').then((snap) => {
            const count = Number(snap.val()) + 1
            return admin.database().ref(`answers/${questionId}`).update({ answersCount: count }).then(() => {
                return admin.database().ref(`questions/${questionId}`).update({ answers: count, answered: true }).then(() => {
                    return admin.database().ref(`answers/${questionId}/answers/${uid}`).update(answerMeta)
                })
            })
        })
    })
})

exports.setActiveDoctor = functions.database.ref('/doctors/{uid}/status').onWrite((change, context) => {
    const uid = context.params.uid
    const status = change.after.val()
    const { approved, name, picture } = context.auth.token
    console.log('status',status)
    console.log('user',context.auth)
    console.log('token',context.auth.token)
    console.log('approved',approved)
    if(!approved){
        return false;
    }

    if(status === 'online'){
        console.log("Hooray I'm online")
        return admin.database().ref(`onlineDoctors/online/${uid}`).update({ name, picture }).then(() => {
            return admin.database().ref(`onlineDoctors/busy/`).update({ [uid]: null })
        })
    }else if(status === 'offline'){
        console.log("Nooooo I'm offline")
        return admin.database().ref(`onlineDoctors/online/`).update({ [uid]: null }).then(() => {
            return admin.database().ref(`onlineDoctors/busy/`).update({ [uid]: null })
        })
    }else if(status === 'busy'){
        console.log("Nooooo I'm busy")
        return admin.database().ref(`onlineDoctors/busy/${uid}`).update({ name, picture }).then(() => {
            return admin.database().ref(`onlineDoctors/online/`).update({ [uid]: null })
        })
    }

    return false;
})

