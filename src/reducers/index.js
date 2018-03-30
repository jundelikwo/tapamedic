import { combineReducers } from 'redux'
import userReducer from './user'
import profileReducer from './profile'

let reducers = combineReducers({
    user: userReducer,
    profile: profileReducer
})

export default reducers