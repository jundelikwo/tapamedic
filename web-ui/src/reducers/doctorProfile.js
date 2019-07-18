import { ADD_CLAIMS, ADD_DOCTOR_PROFILE_DATA, LOGOUT } from '../actions/types'

const initialState = {
    approved: null,
    review: null,
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
                return { ...state, ...action.data, ...action.data.data, mdcnPhoto }
            }
            return { ...state }
        case ADD_CLAIMS:
            let claims = {
                approved: action.claims.approved !== undefined ? action.claims.approved : state.approved,
                review: action.claims.review !== undefined ? action.claims.review : state.review
            }
            return { ...state, ...claims }
        case LOGOUT :
            return { ...initialState }
        default :
            return state
    }
}

export default doctorProfileReducer