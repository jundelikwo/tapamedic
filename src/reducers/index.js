import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'
import walletReducer from './wallet'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer,
    wallet: walletReducer
})

export default reducers