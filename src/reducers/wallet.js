import { ADD_PROFILE_DATA, LOGOUT } from '../actions/types'

const initialState = '0.00'

let walletReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_PROFILE_DATA :
            if(action.data){
                return action.data.wallet || initialState
            }
            return initialState
        case LOGOUT :
            return { ...initialState }
        default:
            return state
    }
}

export default walletReducer;