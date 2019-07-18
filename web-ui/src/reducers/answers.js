import { 
    ADD_ANSWERS_TO_A_QUESTIONS,
    LOGOUT
} from '../actions/types'

const initialState = {
    answers: {}
}

let answersReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_ANSWERS_TO_A_QUESTIONS:
            return {
                ...state,
                answers: {
                    ...state.answers,
                    ...action.answers
                }
            }
        case LOGOUT:
            return { ...initialState }
        default:
            return state
    }
}

export default answersReducer;