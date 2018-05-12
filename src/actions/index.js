import firebase from 'firebase'
import { 
    LOGIN, 
    LOGOUT, 
    ADD_ROLE,
    TOGGLE_ROLE,
    ADD_DISPLAY_NAME, 
    ADD_PROFILE_DATA,
    ADD_DOCTOR_PROFILE_DATA,
    CHANGE_PROFILE_URL, 
    FILE_UPLOAD_PROGRESS
} from './types'

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

export var addRole = (role) => {
    return {
        type: ADD_ROLE,
        role
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

export var addUserData = (data, path='/data') => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        firebase.database().ref(`${role}s/${uid}/profile${path}`).update(data)
            .then(() => {
                console.log('Done')
                var user = firebase.auth().currentUser;
                const { firstName, lastName } = data;
                if( firstName + lastName ){
                    user.updateProfile({
                        displayName: firstName + ' ' + lastName
                    }).then(() => dispatch(addDisplayName(user.displayName)))
                    .catch((e) => console.log(e,'Failed'))
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

        uploadTask.then(snapshot => {
            console.log('Snapshot',snapshot)
            dispatch(changeProfilePhoto(window.URL.createObjectURL(photo)))
        })

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