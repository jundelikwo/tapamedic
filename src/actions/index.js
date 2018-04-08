import firebase from 'firebase'
import { LOGIN, LOGOUT, ADD_ROLE, ADD_DISPLAY_NAME, ADD_PROFILE_DATA, CHANGE_PROFILE_URL } from './types'

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

export var addDisplayName = (name) => {
    return {
        type: ADD_DISPLAY_NAME,
        name
    }
}

export var addUserData = (data) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        firebase.database().ref(`${role}s/${uid}/profile/data`).update(data)
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

export var startAddProfileData = () => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        let profileDataRef = firebase.database().ref(`${role}s/${uid}/profile`)
        
        profileDataRef.on('value',snapshot => {
            console.log(`${role}s/${uid}/profile`)
            dispatch(addProfileData(snapshot.val()))
        })
        return profileDataRef
    }
}

export var uploadProfilePhoto = (photo) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        const fileName = 'profile' + photo.name.substring(photo.name.lastIndexOf('.'))
        let profilePhotoRef = firebase.storage().ref().child(`${role}s/${uid}/${fileName}`)
        var metadata = {
            uid,
            role
        };

        profilePhotoRef.put(photo,metadata).then(snapshot => {
            console.log('Snapshot',snapshot)
            profilePhotoRef.getDownloadURL().then(url => {
                dispatch(changeProfilePhoto(url))
            })
        })
    }
}

export var changeProfilePhoto = (url) => {
    return {
        type: CHANGE_PROFILE_URL,
        url
    }
}