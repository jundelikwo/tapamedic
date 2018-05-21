import { ADD_DOCTOR_PROFILE_DATA, LOGOUT } from '../actions/types'

const initialState = {
    graduation: '',
    firstName: '',
    languages: '',
    mdcnPhoto: '/images/default_avatar.png',
    lastName: '',
    location: '',
    mdcn_folio: '',
    mdcn_membership: '',
    photo: '',
    specialty: '',
    university: ''
}

let doctorProfileReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_DOCTOR_PROFILE_DATA :
            if(action.data){
                let mdcnPhoto = action.data.mdcnPhoto || initialState.mdcnPhoto
                let location = action.data.location
                return { ...action.data.data, mdcnPhoto, location, languages: action.data.languages }
            }
            return { ...initialState }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default doctorProfileReducer