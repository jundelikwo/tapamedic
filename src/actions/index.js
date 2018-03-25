import firebase from 'firebase'
import { LOGIN, LOGOUT, ADD_ROLE, ADD_DISPLAY_NAME } from './types'

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

export var addProfileData = (data) => {
    return (dispatch, getState) => {
        const { uid, role } = getState().user;
        firebase.database().ref(`${role}s/${uid}/data`).update(data)
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