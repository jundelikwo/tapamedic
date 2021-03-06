import firebase from 'firebase'
import uuid from 'uuid'
import { 
    LOGIN, 
    LOGOUT, 
    ADD_CLAIMS,
    ADD_CONSULTATION,
    ADD_PATIENT_QUESTION_TO_STORE,
    ADD_MY_LIST_OF_QUESTIONS,
    ADD_LIST_OF_QUESTIONS,
    ADD_LIST_OF_ONLINE_DOCTORS,
    ADD_MY_QUESTION,
    ADD_ANSWERS_TO_A_QUESTIONS,
    TOGGLE_ROLE,
    ADD_DISPLAY_NAME, 
    ADD_PROFILE_DATA,
    ADD_DOCTOR_PROFILE_DATA,
    ADD_SUPPORTED_LANGUAGES,
    CHANGE_PROFILE_URL, 
    FILE_UPLOAD_PROGRESS,
    REMOVE_PATIENT_QUESTION_FROM_STORE,
    REMOVE_CONSULTATION,
    CHANGE_ASKED_QUESTION_STATUS,
    ENTERING_MESSAGES_ROUTE,
    LEAVING_MESSAGES_ROUTE,
    ADD_MESSAGES
} from './types'
import { lang } from 'moment';

export var login = (user) => {
    return {
        type: LOGIN,
        user
    }
}

export var logout = () => {
    return {
        type: LOGOUT
    }
}

export var addClaims = (claims) => {
    return {
        type: ADD_CLAIMS,
        claims
    }
}

export var toggleRole = () => {
    return {
        type: TOGGLE_ROLE
    }
}

export var addDisplayName = (name) => {
    return {
        type: ADD_DISPLAY_NAME,
        name
    }
}

export var addUserData = (data, path='/data', shouldCallthen=true) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        console.log('path',`${role}s/${uid}/profile${path}`)
        console.log('data',data)
        firebase.database().ref(`${role}s/${uid}/profile${path}`).update(data)
            .then(() => {
                if(shouldCallthen){
                    console.log('Done')
                    var user = firebase.auth().currentUser;
                    const { firstName, lastName } = role === 'doctor' ? data.data : data;
                    if( firstName + lastName ){
                        user.updateProfile({
                            displayName: firstName + ' ' + lastName
                        }).then(() => dispatch(addDisplayName(user.displayName)))
                        .catch((e) => console.log(e,'Failed'))
                    }
                }
            })
            .catch( e => console.log(e,'Failed'))
    }
}

export var addProfileData = (data) => {
    return {
        type: ADD_PROFILE_DATA,
        data
    }
}

export var addDoctorProfileData = (data) => {
    return {
        type: ADD_DOCTOR_PROFILE_DATA,
        data
    }
}

export var startAddProfileData = () => {
    return (dispatch, getState) => {
        const { uid, role, phoneNumber } = getState().user;
        let profileDataRef = firebase.database().ref(`${role}s/${uid}/profile`)
        
        profileDataRef.on('value',snapshot => {
            console.log(`${role}s/${uid}/profile`)
            let data = snapshot.val()
            if(data instanceof Object){
                var user = firebase.auth().currentUser;
                let photoURL = data.photo
                
                if(photoURL && user.photoURL !== photoURL){
                    user.updateProfile({
                        photoURL
                    })
                }
            }
            if(phoneNumber){
                dispatch(addProfileData(data))
            }else{
                dispatch(addDoctorProfileData(data))
            }
        })
        return profileDataRef
    }
}

export var uploadProfilePhoto = (photo, uploadFileFieldName, photoName) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        const fileName = photoName + photo.name.substring(photo.name.lastIndexOf('.'))
        let profilePhotoRef = firebase.storage().ref().child(`${role}s/${uid}/${fileName}`)
        var metadata = {
            uid,
            role
        };
        let uploadTask = profilePhotoRef.put(photo,metadata)

        if(photoName === "profile"){
            uploadTask.then(snapshot => {
                console.log('Snapshot',snapshot)
                dispatch(changeProfilePhoto(window.URL.createObjectURL(photo)))
            })
        }

        uploadTask.on('state_changed', snapshot => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%';
            dispatch(changeUploadProgress(uploadFileFieldName, progress))
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        })
    }
}

export var changeProfilePhoto = (url) => {
    return {
        type: CHANGE_PROFILE_URL,
        url
    }
}

export var changeUploadProgress = (key, value) => {
    return {
        type: FILE_UPLOAD_PROGRESS,
        key,
        value
    }
}

export var startAddSupportedLanguages = () => {
    return (dispatch) => {
        let langRef = firebase.database().ref('languages').orderByValue().equalTo(true)
        langRef.once('value', snapshot => {
            let langs = Object.keys(snapshot.val())
            console.log('langs',langs)
            dispatch(addSupportedLanguages(langs))
        })
    }
}

export var addSupportedLanguages = (lang) => {
    return {
        type: ADD_SUPPORTED_LANGUAGES,
        lang
    }
}

export var addPatientQuestionToStore = question => {
    return {
        type: ADD_PATIENT_QUESTION_TO_STORE,
        question
    }
}

export var removePatientQuestionFromStore = () => {
    return {
        type: REMOVE_PATIENT_QUESTION_FROM_STORE
    }
}

export var askQuestion = (text) => {
    return (dispatch, getState) => {
        dispatch(changeAskedQuestionStatus(true))
        const {  role, uid, language } = getState().user;
        let question = {
            text,
            language
        }
        let questionRef = firebase.database().ref(`${role}s/${uid}/questions`).push(question)
        questionRef.then(()=>{
            dispatch(changeAskedQuestionStatus(false))
        })
    }
}

export var changeAskedQuestionStatus = status => {
    return {
        type: CHANGE_ASKED_QUESTION_STATUS,
        status
    }
}

export var startAddListOfPatientQuestions = () => {
    return (dispatch, getState) => {
        console.log('startAddListOfPatientQuestions')
        const { uid, role } = getState().user;
        let questionsRef = firebase.database().ref(`${role}s/${uid}/questions`)
        
        questionsRef.once('value',snapshot => {
            var res = snapshot.val() || {}
            var keys = Object.keys(res) || []
            var questions = keys.map((id) => {
                return {
                    ...res[id],
                    id
                }
            })
            dispatch(addListOfPatientQuestions(questions))
        })

        questionsRef.on('child_changed', (snapshot) => {
            var question = {
                id: snapshot.key,
                ...snapshot.val()
            }
            dispatch(addMyQuestion(question))
        })
    }
}

export var addListOfPatientQuestions = questions => {
    return {
        type: ADD_MY_LIST_OF_QUESTIONS,
        questions
    }
}

export var addMyQuestion = question => {
    return {
        type: ADD_MY_QUESTION,
        question
    }
}

export var startAddQuestionsList = () => {
    return (dispatch, getState) => {
        const { role } = getState().user;
        let questionsRef = firebase.database().ref('questions')       
        
        questionsRef.on('value',snapshot => {
            var questions = snapshot.val() || {}
            // var keys = Object.keys(res) || []
            // var questions = keys.map((id) => {
            //     return {
            //         ...res[id],
            //         id
            //     }
            // })
            console.log('add list of questions', questions)
            dispatch(addListOfQuestions(questions))
        })
    }   
}

var addListOfQuestions = questions => {
    return {
        type: ADD_LIST_OF_QUESTIONS,
        questions
    }
}

export var fetchAnswers = slug => {
    return (dispatch, getState) => {
        let answersRef = firebase.database().ref('answers').orderByChild('slug').equalTo(slug)

        if(!getState().answers.answers[slug]){
            console.log('fetching....',slug);
            answersRef.on('value',snapshot => {
                console.log('fetched',snapshot.val())
                let val = snapshot.val()
                let key = Object.keys(val)[0]
                let answers = {
                    [slug]: { ...val[key], key }
                }
                dispatch(saveAnswers(answers))
            })
        }
    }
}

const saveAnswers = answers => {
    return {
        type: ADD_ANSWERS_TO_A_QUESTIONS,
        answers
    }
}

export var answerAQuestion = (id,answer) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        firebase.database().ref(`answers/${id}/answers/${uid}`).update({ text: answer })
    }
}


export var goOnline = () => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        const userRef = firebase.database().ref(`${role}s/${uid}/status`)
        firebase.database().ref('.info/connected').on('value',snap=>{
            if(snap.val()){
                //userRef.onDisconnect().remove();
                userRef.onDisconnect().set('offline');
                userRef.set('online')
            }
        })
    }
}

export var goOffline = () => {
    return (dispatch, getState) => {
        console.log('goOffline')
        const { uid, role } = getState().user;
        const userRef = firebase.database().ref(`${role}s/${uid}/status`)
        userRef.set('offline').then(() => {
            console.log('I am offline')
            //dispatch(logout())
        })
    }
}

export var fetchLoggedInDoctors = () => {
    return (dispatch, getState) => {
        if(getState().user.role === 'patient'){
            firebase.database().ref('onlineDoctors').on('value',snapshot => {
                let doctors = snapshot.val();
                doctors = doctors || {}
                doctors.online = doctors.online || {}
                doctors.busy = doctors.busy || {}
                console.log('onlineDoctors',doctors)
                if(doctors){
                    dispatch(saveOnlineDoctors(doctors))
                }
            })
        }
    }
}

const saveOnlineDoctors = doctors => {
    return {
        type: ADD_LIST_OF_ONLINE_DOCTORS,
        doctors
    }
}

export var initiateConsultation = (id, name, picture) => {
    return (dispatch, getState) => {
        const { uid } = getState().user;
        console.log('initiateConsultation',{ doctor: id, name, picture })
        firebase.database().ref(`patients/${uid}/consultation`).push({ accepted: false, doctor: id, name, picture })
    }
}

export var startFetchConsultations = () => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        firebase.database().ref(`/${role}s/${uid}/consultation`).on('value',snapshot => {
            const consultations = snapshot.val()
            console.log('Consultation',consultations)
            if(consultations){
                console.log('CONSULTATION LIST',Object.keys(consultations))
                Object.keys(consultations).forEach(key => {
                    if(!(key in getState().consultations)){
                        dispatch(fetchConsultation(key))
                    }
                })
            }
        })
    }
}

const fetchConsultation = key => {
    return (dispatch, getState) => {
        firebase.database().ref(`consultation/${key}`).on('value',snap=>{
            const consultation = snap.val()
            console.log('Consultation key : ',key,':data',consultation)
            if(consultation){
                dispatch(addConsultation(key,consultation))
                dispatch(fetchMessages(key))
            }else{
                const consultations = {...getState().consultations}
                delete consultations[key]
                dispatch(removeConsultation(consultations))
            }
        })
    }
}

const addConsultation = (key,consultation) => {
    return {
        type: ADD_CONSULTATION,
        key,
        consultation
    }
}

const removeConsultation = consultations => {
    return {
        type: REMOVE_CONSULTATION,
        consultations
    }
}

const toggleConsultation = accepted => {
    return id => {
        return (dispatch, getState) => {
            const { uid } = getState().user;
            console.log(`doctors/${uid}/consultation/${id}`,accepted)
            firebase.database().ref(`doctors/${uid}/consultation/${id}`).update({ accepted })
        }
    }
}

export var acceptConsultation = toggleConsultation(true)
export var rejectConsultation = toggleConsultation(null)

export var enterMessagesRoute = consultId => {
    return {
        type: ENTERING_MESSAGES_ROUTE,
        consultId
    }
}

export var leaveMessagesRoute = () => {
    return {
        type: LEAVING_MESSAGES_ROUTE
    }
}

export var sendMessage = (consultId,message) => {
    return (dispatch,getState) => {
        const { user, messages } = getState();
        const chat = { user: user.uid, message }

        firebase.database().ref(`/messages/${consultId}/`).push(chat)
        console.log('Send Message', message," : consultId",consultId," : user",user.uid)
        dispatch(addMessages(consultId, {
            ...messages[consultId] || {},
            [uuid()]: chat
        }))
    }
}

const fetchMessages = key => {
    return (dispatch,getState) => {
        if(!(key in getState().messages)){
            firebase.database().ref(`messages/${key}`).on('value',snap=>{
                dispatch(addMessages(key,snap.val()))
            })
        }
    }
}

const addMessages = (key,messages) => {
    return {
        type: ADD_MESSAGES,
        key,
        messages
    }
}

export var uploadConsultationPhoto = (consultId, photo) => {
    return (dispatch, getState) => {
        const { messages, user } = getState()
        const { uid, role } = user;
        const uniqueId = uuid()
        const fileName = uniqueId + photo.name.substring(photo.name.lastIndexOf('.'))
        let profilePhotoRef = firebase.storage().ref().child(`consultation/${consultId}/${uid}/${fileName}`)
        
        var metadata = {
            uid: uid,
            role: role
        };
        let uploadTask = profilePhotoRef.put(photo,metadata)

        const url = window.URL.createObjectURL(photo)
        dispatch(addMessages(consultId, {
            ...messages[consultId] || {},
            [uniqueId]: {
                user: uid,
                thumb: url,
                image: url
            }
        }))
    }
}

export var initiateWebRTC = (media,id) => {
    return () => {
        console.log(`/consultation/${id}/opentok/webrtc`,media)
        firebase.database().ref(`/consultation/${id}/opentok/webrtc`).set(media)
    }
}