import { 
    ADD_PATIENT_QUESTION_TO_STORE, 
    REMOVE_PATIENT_QUESTION_FROM_STORE,
    LOGOUT,
    CHANGE_ASKED_QUESTION_STATUS
} from '../actions/types'

const initialState = {
    ask: '',
    askedQuestionStatus: false,
    questions: {}
}

let questionsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_PATIENT_QUESTION_TO_STORE:
            return { ...state, ask: action.question }
        case REMOVE_PATIENT_QUESTION_FROM_STORE:
            return { ...state, ask:initialState.ask }
        case CHANGE_ASKED_QUESTION_STATUS:
            return { ...state, askedQuestionStatus: action.status}
        case LOGOUT:
            return { ...initialState }
        default:
            return state
    }
}

export default questionsReducer;