import { ADD_PROFILE_DATA } from '../actions/types'

const initialState = '0.00'

let walletReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_PROFILE_DATA :
            if(action.data.wallet){
                return action.data.wallet
            }
            return initialState
        default:
            return state
    }
}

export default walletReducer;