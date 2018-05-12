import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'
import fileUploadReducer from './fileUpload'
import doctorProfileReducer from './doctorProfile'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer,
    fileUpload: fileUploadReducer,
    doctorProfile: doctorProfileReducer
})

export default reducers