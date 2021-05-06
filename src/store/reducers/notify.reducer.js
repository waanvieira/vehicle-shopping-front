import { actionTypes } from '../actions/notify.action'

const initialState = {
    open: false,    
    horizontal: 'center',
    vertical: 'top',
    class: 'success',
    time: 3000,
    msg: '',
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad }) => {
    switch (type) {

        case actionTypes.CHANGE:
            return { ...state, ...payLoad }

        default:
            return state
    }

}
