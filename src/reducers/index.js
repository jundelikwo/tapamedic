import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'
import fileUploadReducer from './fileUpload'
import doctorProfileReducer from './doctorProfile'
import languagesReducer from './languages'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer,
    fileUpload: fileUploadReducer,
    doctorProfile: doctorProfileReducer,
    languages: languagesReducer
})

export default reducers