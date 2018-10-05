import { 
    LOGOUT
} from '../actions/types'

const initialState = {
    answers: {}
}

let answersReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGOUT:
            return { ...initialState }
        default:
            return state
    }
}

export default answersReducer;