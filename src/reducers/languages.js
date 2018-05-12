import { ADD_SUPPORTED_LANGUAGES } from '../actions/types'
import { lang } from 'moment';

const initialState = [
    'English'
]

let languagesReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_SUPPORTED_LANGUAGES:
            return action.lang
        default:
            return state
    }
}

export default languagesReducer;