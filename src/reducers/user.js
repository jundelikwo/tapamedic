import { LOGIN, LOGOUT, ADD_ROLE } from '../actions/types'

let userReducer = (state = {} , action ) => {
    switch(action.type){
        case LOGIN :
            return { uid: action.user.uid, phoneNumber: action.user.phoneNumber }
        case ADD_ROLE:
            return { ...state, role: action.role }
        case LOGOUT :
            return {}
        default :
            return state
    }
}

export default userReducer