import { 
    ADD_MESSAGES,
    LOGOUT
} from '../actions/types'

const initialState = {}

let messagesReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_MESSAGES:
            console.log('ADD_MESSAGES',{
                ...state,
                [action.key]: action.messages
            })
            return {
                ...state,
                [action.key]: action.messages
            }
        case LOGOUT:
            return { ...initialState }
        default:
            return state
    }
}

export default messagesReducer;