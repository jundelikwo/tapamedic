import firebase from 'firebase'
import { 
    LOGIN, 
    LOGOUT, 
    ADD_CLAIMS,
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
    CHANGE_ASKED_QUESTION_STATUS
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