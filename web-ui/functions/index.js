const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
//admin.initializeApp(functions.config().firebase);

var serviceAccount = require("./service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tapamedic-7a09f.firebaseio.com"
});

const OPENTOK_API_KEY = functions.config().opentok.api;
const OPENTOK_API_SECRET = functions.config().opentok.secret;
let OpenTok = require('opentok');
let opentok = new OpenTok(OPENTOK_API_KEY, OPENTOK_API_SECRET);

const paystackKey = functions.config().paystack.key
var paystack = require('paystack')(paystackKey);
var request = require('request');

const waitingTime = 3 // time in minutes
const consultationCost = 600 // in Naira
const doctorCut = 400 // in Naira
const ourCut = 200 // in Naira

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
            const { amount, reference, customer, status } = body.data
            id = customer.email.substring(0,customer.email.lastIndexOf('@'))
            if(id !== context.auth.token.phone_number){
                return null;
            }
            if(status !== 'success'){
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
    
    console.log('Object',object)

    // Exit if this is triggered on a file that is not an image.
    if (!contentType.startsWith('image/')) {
        console.log('This is not an image.');
        return null;
    }

    if (metadata.isResized) {
        console.log('Exiting: Already been resized')
        return null
    }

    console.log('File Path',filePath)
    
    if(filePath.indexOf('/profile.') !== -1){
        console.log("Yeah I'm a profile image")
        return photoFunc(object,'profile','200x200>','profile',"photo")
    }else if(filePath.indexOf('/mdcnPhoto.') !== -1){
        console.log("Yeah I'm a mdcnPhoto image")
        return photoFunc(object,'mdcnPhoto','200x200>','profile','mdcnPhoto')
    }else if(filePath.indexOf('consultation/') !== -1){
        console.log('Consultation photo', metadata)
        return consultPhotoFunc(object)
    }
    return null
});

function consultPhotoFunc(object){
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const metadata = object.metadata

    const filePathSplit = filePath.split('/')
    const consultId = filePathSplit[1]
    const user = filePathSplit[2]

    console.log('consultId',consultId,'user','user')

    // Get the file name.
    const fileName = path.basename(filePath);

    const thumbFileName = `thumb_${fileName}`;
    const thumbFilePath = path.join(path.dirname(filePath), thumbFileName);

    // Download file from bucket.
    const bucket = gcs.bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const options = {
        contentType: contentType,
        isResized: true
    };
    return bucket.file(filePath).download({
        destination: tempFilePath,
    }).then(() => {
        console.log('Image downloaded locally to', tempFilePath);
        // Generate a thumbnail using ImageMagick.
        return spawn('convert', [tempFilePath, '-thumbnail', '400x400>', tempFilePath]);
    }).then(() => {
        console.log('Thumbnail created at', tempFilePath);
        // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
        // Uploading the thumbnail.
        return bucket.upload(tempFilePath, {
            destination: thumbFilePath,
            metadata: { metadata: options }
        });
    // Once the thumbnail has been uploaded delete the local file to free up disk space.
    }).then(() => { 
            fs.unlinkSync(tempFilePath)
            return bucket.file(thumbFilePath).getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            }).then(signedUrls => {
                // signedUrls[0] contains the file's public URL
                const thumbLink = signedUrls[0]
                console.log('metadata',metadata)
                return bucket.file(filePath).getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                }).then(mainUrls => {
                    // mainUrls[0] contains the file's public URL
                    const fullLink = mainUrls[0]
                    console.log('Register in database')
                    return admin.database().ref(`/messages/${consultId}/`).push({
                        user,
                        thumb: thumbLink,
                        image: fullLink
                    })
                });
            });
        })
}

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
		//return spawn('convert', [tempFilePath, '-resize', resizedImgSize, '-channel', 'RGBA', '-blur', '0x24',  JPGFilePath]);
        return spawn('convert', [tempFilePath, '-resize', resizedImgSize, JPGFilePath]);
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

exports.initializeConsultation = functions.database.ref('/patients/{uid}/consultation/{consultId}').onCreate((snapshot, context) => {
    const { consultId, uid } = context.params
    let { name, picture } = context.auth.token
    const doctorId = snapshot.val().doctor
    const initTime = new Date().getTime()

    name = name || ''
    picture = picture || 'https://tapamedic-7a09f.firebaseapp.com/images/default_avatar.png'
    console.log('Menanma')
    console.log(`snapshot.val().doctor: ${snapshot.val().doctor}`)
    console.log(`context.auth.token name: ${name}: photo: ${picture}`)
    return admin.database().ref(`consultation/${consultId}`).set({ 
        doctor: {
            id: doctorId,
            name: snapshot.val().name,
            photo: snapshot.val().picture
        },
        patient: {
            id: uid,
            name,
            photo: picture
        },
        initTime, 
        accepted: false,
        started: false 
    }).then(() => {
        console.log('doctor initializeConsultation')
        return admin.database().ref(`doctors/${doctorId}/consultation/${consultId}`).set({ name, patient: uid, picture, accepted: false, initTime })
    })
})

exports.deleteConsultation = functions.database.ref('/consultation/{consultId}').onDelete((snapshot, context) => {
    const original = snapshot.val()
    const consultId = context.params.consultId
    return admin.database().ref(`doctors/${original.doctor.id}/consultation/${consultId}`).remove().then(() => {
        return admin.database().ref(`patients/${original.patient.id}/consultation/${consultId}`).remove()
    })
})   

exports.rejectConsultation = functions.database.ref('doctors/{uid}/consultation/{consultId}/accepted').onDelete((snapshot, context) => {
    const consultId = context.params.consultId
    console.log('rejectConsultation')
    return admin.database().ref(`consultation/${consultId}`).remove()
})

exports.acceptConsultation = functions.database.ref('doctors/{uid}/consultation/{consultId}/accepted').onUpdate((snapshot, context) => {
    const { consultId, uid } = context.params
    let time = new Date().getTime()
    console.log('acceptConsultation',time)
    if(snapshot.after.val()){
        console.log('Hooray you acceptConsultation')
        return admin.database().ref(`consultation/${consultId}`).once('value',snapshot => {
            const { initTime,patient } = snapshot.val()
            if((time - initTime)/1000/60 > waitingTime){
                console.log('oops timeout')
                return admin.database().ref(`doctors/${uid}/consultation/${consultId}/accepted`).remove()
            }
            console.log('yeah still time')
            return admin.database().ref(`patients/${patient.id}/profile/wallet`).once('value',snap => {
                const wallet = snap.val()
                if(wallet >= consultationCost){
                    return admin.database().ref(`doctors/${uid}/profile/wallet`).once('value',walSnap => {
                        console.log('Finally accepted',walSnap.val())
                        time = new Date()
                        console.log('startTime',time.getFullYear(),'/',time.getMonth() + 1,'/',time.getDate())
                        let doctorWallet = walSnap.val() || 0
                        doctorWallet += doctorCut
                        return opentok.createSession({}, (error, session) => {
                            if (error) {
                              console.log("Error creating session:", error)
                            } else {
                              let sessionId = session.sessionId;
                              console.log("Session ID: " + sessionId);
                              //  Use the role value appropriate for the user:
                              var tokenOptions = {};
                              tokenOptions.role = "publisher";
                              tokenOptions.data = "username=bob";
                              tokenOptions.expireTime = new Date().getTime() + 60 * 30;
                        
                              // Generate a token.
                              let token = opentok.generateToken(sessionId, tokenOptions);
                              console.log('token',token);
                              return admin.database().ref('/').update({
                                  [`consultation/${consultId}/accepted`]: true,
                                  [`consultation/${consultId}/started`]: true,
                                  [`consultation/${consultId}/startTime`]: time.getTime(),
                                  [`consultation/${consultId}/opentok`]: { session: sessionId, token },
                                  [`patients/${patient.id}/consultation/${consultId}/accepted`]: true,
                                  [`patients/${patient.id}/profile/wallet`]: wallet - consultationCost,
                                  [`doctors/${uid}/profile/wallet`]: doctorWallet,
                                  [`payments/${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}/${consultId}`]: ourCut
                              })
                            }
                        })
                    })
                }
                console.log('insufficient funds')
                return admin.database().ref(`doctors/${uid}/consultation/${consultId}/accepted`).remove()
            })
        })
    }
    return null;
})

exports.addLastMessageToConsultation = functions.database.ref('messages/{consultId}/{messageId}').onCreate((snapshot, context) => {
    const { message, user, thumb } = snapshot.val()
    const { consultId, messageId } = context.params
    if(message){
        let text = message.substr(0,30)
        if(message.length > 30){
            text += '...'
        }
        return admin.database().ref(`consultation/${consultId}/lastMessage`).set({
            user,
            message: text
        })
    }else if(thumb){
        return admin.database().ref(`consultation/${consultId}/lastMessage`).set({
            user,
            thumb
        })
    }
    return null
})