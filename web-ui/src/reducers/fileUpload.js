import { FILE_UPLOAD_PROGRESS, LOGOUT } from '../actions/types'

const initialState = {
    profilePhoto: null,
    mdcnPhoto: null
}

let fileUploadReducer = (state = initialState, action) => {
    switch(action.type){
        case FILE_UPLOAD_PROGRESS :
            const { key, value } = action
            let data = { ...state }
            data[key] = value
            return { ...data }
        case LOGOUT :
            return { ...initialState }
        default:
            return state
    }
}

export default fileUploadReducer;