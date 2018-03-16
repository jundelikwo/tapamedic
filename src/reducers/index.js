import { combineReducers } from 'redux'
import userReducer from './user'

let reducers = combineReducers({
    user: userReducer
})

export default reducers