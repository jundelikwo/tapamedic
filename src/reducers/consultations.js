import { 
    ADD_CONSULTATION,
    REMOVE_CONSULTATION,
    LOGOUT
} from '../actions/types'

const initialState = {}

let consultationsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_CONSULTATION:
            console.log('ADD_CONSULTATION',{
                ...state,
                [action.key]: action.consultation
            })
            return {
                ...state,
                [action.key]: action.consultation
            }
        case REMOVE_CONSULTATION:
            console.log('REMOVE_CONSULTATION',action.consultations)
            return action.consultations
        case LOGOUT:
            return { ...initialState }
        default:
            return state
    }
}

export default consultationsReducer;