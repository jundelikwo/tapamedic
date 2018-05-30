import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'
import fileUploadReducer from './fileUpload'
import doctorProfileReducer from './doctorProfile'
import languagesReducer from './languages'
import questionsReducer from './questions'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer,
    fileUpload: fileUploadReducer,
    doctorProfile: doctorProfileReducer,
    languages: languagesReducer,
    questions: questionsReducer
})

export default reducers