import { ADD_PROFILE_DATA, LOGOUT } from '../actions/types'

const initialState = {
    address: '',
    blood: '',
    diseases: '',
    dob: '',
    drugs: '',
    firstName: '',
    occupation: '',
    genotype: '',
    lastName: '',
    sex: ''
}

let profileReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_PROFILE_DATA :
            if(action.data){
                return { ...state, ...action.data.data }
            }
            return { ...state }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default profileReducer