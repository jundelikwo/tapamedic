import { LOGIN, LOGOUT, ADD_ROLE, ADD_DISPLAY_NAME } from '../actions/types'

const initialState = {
    uid: null,
    phoneNumber: null,
    role: "",
    name: 'Anonymous'
}

let userReducer = (state = initialState , action ) => {
    switch(action.type){
        case LOGIN :
            let name = action.user.displayName || initialState.name
            return { uid: action.user.uid, phoneNumber: action.user.phoneNumber, name }
        case ADD_ROLE:
            return { ...state, role: action.role }
        case ADD_DISPLAY_NAME:
            return { ...state, name: action.name }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default userReducer