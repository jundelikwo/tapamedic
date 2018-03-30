import { ADD_PROFILE_DATA } from '../actions/types'

const initialState = {
    address: '',
    blood: '',
    diseases: '',
    dob: 0,
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
            return { ...action.data }
        default :
            return { ...initialState }
    }
}

export default profileReducer