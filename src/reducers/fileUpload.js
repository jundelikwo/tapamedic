import { FILE_UPLOAD_PROGRESS } from '../actions/types'

const initialState = {
    profilePhoto: null
}

let fileUploadReducer = (state = initialState, action) => {
    switch(action.type){
        case FILE_UPLOAD_PROGRESS :
            const { key, value } = action
            let data = { ...state }
            data[key] = value
            return { ...data }
        default:
            return state
    }
}

export default fileUploadReducer;