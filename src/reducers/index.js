import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'
import fileUploadReducer from './fileUpload'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer,
    fileUpload: fileUploadReducer
})

export default reducers