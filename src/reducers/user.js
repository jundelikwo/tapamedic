import { 
    LOGIN, 
    LOGOUT, 
    ADD_CLAIMS, 
    ADD_PROFILE_DATA, 
    ADD_DISPLAY_NAME, 
    CHANGE_PROFILE_URL,
    TOGGLE_ROLE
} from '../actions/types'

const initialState = {
    uid: null,
    phoneNumber: null,
    email: null,
    emailVerified: false,
    photoURL: '/images/default_avatar.png',
    role: "patient",
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
            } else if(action.user.email){
                role = 'doctor'
            }
            return { 
                uid: action.user.uid, 
                phoneNumber: action.user.phoneNumber, 
                email: action.user.email,
                emailVerified: action.user.emailVerified,
                name,
                photoURL,
                role
            }
        case ADD_CLAIMS:
            return { ...state, role: action.claims.role || state.role }
        case TOGGLE_ROLE:
            role = state.role
            if(role === 'patient'){
                role = 'doctor'
            }else{
                role = 'patient'
            }
            return { ...state, role }
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