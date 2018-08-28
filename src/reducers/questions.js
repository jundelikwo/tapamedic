import { 
    ADD_PATIENT_QUESTION_TO_STORE, 
    ADD_MY_LIST_OF_QUESTIONS,
    ADD_MY_QUESTION,
    ADD_LIST_OF_QUESTIONS,
    REMOVE_PATIENT_QUESTION_FROM_STORE,
    LOGOUT,
    CHANGE_ASKED_QUESTION_STATUS
} from '../actions/types'

const initialState = {
    ask: '',
    askedQuestionStatus: false,
    questions: {},
    questionsIAsked: []
}

let questionsReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_PATIENT_QUESTION_TO_STORE:
            return { ...state, ask: action.question }
        case ADD_MY_LIST_OF_QUESTIONS:
            return { ...state, questionsIAsked: action.questions }
        case ADD_MY_QUESTION:
            return { ...state, questionsIAsked: [ ...state.questionsIAsked, action.question ] }
        case ADD_LIST_OF_QUESTIONS:
            return { ...state, questions: action.questions }
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