import { actionTypes } from '../actions/loading.action'

// Estado inicial da constante, no caso modal aberta com a mensagem carregando
const initialState = {
    open: false,
    msg: 'Carregando...',
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