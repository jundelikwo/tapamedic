import { 
    ENTERING_MESSAGES_ROUTE,
    LEAVING_MESSAGES_ROUTE
} from '../actions/types'

const initialState = {
    isMessagesRoute: false,
    consultId: null
}

let routerReducer = (state = initialState, action) => {
    switch(action.type){
        case ENTERING_MESSAGES_ROUTE :
            return { isMessagesRoute: true, consultId: action.consultId }
        case LEAVING_MESSAGES_ROUTE :
            return initialState
        default:
            return state
    }
}

export default routerReducer;