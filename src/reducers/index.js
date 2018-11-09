import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'
import fileUploadReducer from './fileUpload'
import doctorProfileReducer from './doctorProfile'
import doctorsReducer from './doctors'
import languagesReducer from './languages'
import questionsReducer from './questions'
import answersReducer from './answers'

let reducers = combineReducers({
    answers: answersReducer,
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer,
    fileUpload: fileUploadReducer,
    doctorProfile: doctorProfileReducer,
    doctors: doctorsReducer,
    languages: languagesReducer,
    questions: questionsReducer
})

export default reducers