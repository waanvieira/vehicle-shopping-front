import { actionTypes } from '../actions/register.action'

const initialState = {
    user: {
        name: '',
        email: '',
        password: ''
    },
    success: false,
    error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad }) => {    
    switch (type) {
        
        case actionTypes.CHANGE:
            return { ...state,
                    user: {
                        ...state.user,
                        ...payLoad
                    }
                    
                }

        case actionTypes.SUCCESS:
            return { ...state,
                    success: payLoad                     
                    }
                    
        case actionTypes.ERROR:
            return { ...state,
                    error: payLoad
                    }
                
        default:
            return state
    }

}