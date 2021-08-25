import { HttpAuth } from '../../config/Http'
import { changeNotify } from '../actions/notify.action'

export const actionTypes = {
    INDEX: 'NOTE_INDEX',
    STORE: 'NOTE_STORE',
    UPDATE: 'NOTE_UPDATE',
    DESTROY: 'NOTE_DESTROY',
    CHANGE: 'NOTE_CHANGE'
}

export const change = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})

export const indexResponse = (payLoad, isLoadMore) => ({
    type: actionTypes.INDEX,
    payLoad,
    isLoadMore
})

export const index = (query, isLoadMore) => dispatch => {
    return HttpAuth.get(`/notes?` + new URLSearchParams(query))
        .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data, isLoadMore)))
}

export const storeResponse = (payLoad) => ({
    type: actionTypes.STORE,
    payLoad    
})


export const store = (data) => dispatch => {
    return HttpAuth.post(`/notes`, data)
        .then(res => typeof res != 'undefined' && dispatch(storeResponse(res.data)))
}

export const updateResponse = (payLoad) => ({
    type: actionTypes.UPDATE,
    payLoad    
})

export const update = (data) => dispatch => {
    return HttpAuth.put(`/notes/${data.uuid}`, data)
        .then(res => {
            if (typeof res !== 'undefined') {
                if (res.data.status === 200) {
                    dispatch(updateResponse(data))
                }

                if (res.data.error) {
                    dispatch( changeNotify({
                        open: true,
                        msg: res.data.error,
                        class: 'error'
                    }))
                }
                
            }
        })
}

export const destroyResponse = (payLoad) => ({
    type: actionTypes.DESTROY,
    payLoad    
})


export const destroy = (data) => dispatch => {
    return HttpAuth.delete(`/notes/${data.uuid}`)
        .then(res => typeof res != 'undefined' && dispatch(destroyResponse(data.id)))
}

const initialState = {
    notes: {
        data: []
    },
    note: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad, isLoadMore }) => {
    switch (type) {
        case actionTypes.INDEX:

            if (isLoadMore) {
                payLoad.notes.data = state.notes.data.concat(payLoad.notes.data);
            }

            return { ...state, ...payLoad }
            
        case actionTypes.STORE:
            
            state.notes.total = state.notes.total + 1;

            return {
                ...state,
                notes: {
                    ...state.notes,
                    data: [
                        ...[payLoad],
                        ...state.notes.data
                    ]
                }            
            }
            
        case actionTypes.UPDATE:
            let index = state.notes.data.findIndex(item => item.id === payLoad.id);

            state.notes.data[index] = payLoad;

            return { ...state,
                    notes: {
                        ...state.notes,
                        data: state.notes.data                        
                    }
            }

        case actionTypes.DESTROY:
            state.notes.total = state.notes.total -1;

            return {
                ...state,
                notes: {
                    ...state.notes,
                    data: state.notes.data.filter(item => item.id !== payLoad)
                }
            }

        case actionTypes.CHANGE:
            return {
                ...state,
                note: (payLoad === 'clear') ? {} : {
                    ...state.note,
                    ...payLoad
                }
            }

        default:
            return state
    }

}

