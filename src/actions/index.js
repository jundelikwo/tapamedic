import { LOGIN, LOGOUT, ADD_ROLE } from './types'

export var login = (user) => {
    return {
        type: LOGIN,
        user
    }
}

export var logout = () => {
    return {
        type: LOGOUT
    }
}

export var addRole = (role) => {
    return {
        type: ADD_ROLE,
        role
    }
}