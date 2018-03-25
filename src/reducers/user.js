import { LOGIN, LOGOUT, ADD_ROLE, ADD_DISPLAY_NAME } from '../actions/types'

let userReducer = (state = {} , action ) => {
    switch(action.type){
        case LOGIN :
            return { uid: action.user.uid, phoneNumber: action.user.phoneNumber, name: action.user.displayName }
        case ADD_ROLE:
            return { ...state, role: action.role }
        case ADD_DISPLAY_NAME:
            return { ...state, name: action.name }
        case LOGOUT :
            return {}
        default :
            return state
    }
}

export default userReducer