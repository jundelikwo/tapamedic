import { LOGIN, LOGOUT, ADD_ROLE, ADD_DISPLAY_NAME, CHANGE_PROFILE_URL } from '../actions/types'

const initialState = {
    uid: null,
    phoneNumber: null,
    photoURL: '/images/default_avatar.png',
    role: "",
    name: ''
}

let userReducer = (state = initialState , action ) => {
    switch(action.type){
        case LOGIN :
            let name = action.user.displayName || initialState.name
            let photoURL = action.user.photoURL || initialState.photoURL
            let smallPhotoURL = 'thumb_' + photoURL
            return { 
                uid: action.user.uid, 
                phoneNumber: action.user.phoneNumber, 
                name, 
                photoURL,
                smallPhotoURL
            }
        case ADD_ROLE:
            return { ...state, role: action.role }
        case ADD_DISPLAY_NAME:
            return { ...state, name: action.name }
        case CHANGE_PROFILE_URL:
            photoURL = action.url
            smallPhotoURL = 'thumb_' + photoURL
            return { ...state, photoURL, smallPhotoURL }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default userReducer