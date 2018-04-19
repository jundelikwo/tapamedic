import { LOGIN, LOGOUT, ADD_ROLE, ADD_PROFILE_DATA, ADD_DISPLAY_NAME, CHANGE_PROFILE_URL } from '../actions/types'

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
            let { role } = initialState
            if(action.user.phoneNumber){
                role = 'patient'
            }
            return { 
                uid: action.user.uid, 
                phoneNumber: action.user.phoneNumber, 
                name,
                photoURL,
                role
            }
        case ADD_ROLE:
            return { ...state, role: action.role }
        case ADD_DISPLAY_NAME:
            return { ...state, name: action.name }
        case ADD_PROFILE_DATA :
            photoURL = initialState.photoURL
            if(action.data){
                photoURL = action.data.photo || photoURL
            }
            return { ...state, photoURL }
        case CHANGE_PROFILE_URL:
            photoURL = action.url
            return { ...state, photoURL }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default userReducer