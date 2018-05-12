import { ADD_DOCTOR_PROFILE_DATA, LOGOUT } from '../actions/types'

const initialState = {
    graduation: '',
    firstName: '',
    languages: '',
    mdcn_photo: '/images/default_avatar.png',
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
                let mdcn_photo = action.data.mdcn_photo || initialState.mdcn_photo
                let location = action.data.location
                return { ...action.data.data, mdcn_photo, location }
            }
            return { ...initialState }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default doctorProfileReducer