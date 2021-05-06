import { actionTypes } from '../actions/auth.action'

const initialState = {
    credentials: {
        email: '',
        password: '',
    },
    success: false
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad }) => {
    switch (type) {
        case actionTypes.CHANGE:
            return {
                     ...state,
                     credentials: {
                        ...state.credentials,
                        ...payLoad
                    }
                }

        case actionTypes.SUCCESS:
            return {
                    ...state,
                    success: payLoad
                }

        default:
            return state
    }
}