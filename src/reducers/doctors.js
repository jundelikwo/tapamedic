import {
    ADD_LIST_OF_ONLINE_DOCTORS,
    LOGOUT
} from '../actions/types'

const initialState = {
    online: {},
    busy: {}
}

let doctorReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_LIST_OF_ONLINE_DOCTORS:
            return action.doctors
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default doctorReducer