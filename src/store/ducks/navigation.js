export const actionTypes = {
    SCREEN_A: 'SCREEN_A',
    SCREEN_B: 'SCREEN_B',
    SCREEN_C: 'SCREEN_C'
}

export const changeScreenA = (payLoad) => ({
    type: actionTypes.SCREEN_A,
    payLoad
})

export const changeScreenB = (payLoad) => ({
    type: actionTypes.SCREEN_B,
    payLoad
})

export const changeScreenC = (payLoad) => ({
    type: actionTypes.SCREEN_C,
    payLoad
})

const initialState = {
    screenA: {
        open: false,
        type: null,
        props: {}
    },
    screenB: {
        open: false,
        type: null,
        props: {}
    },
    screenC: {
        open: false,
        type: null,
        props: {}
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad }) => {
    switch (type) {

        case actionTypes.SCREEN_A:
            return { 
                ...state,
                screenA: {
                    ...payLoad
                }
            }
            
        case actionTypes.SCREEN_B:
            return { 
                ...state,
                screenB: {
                    ...payLoad
                }
            }
            
        case actionTypes.SCREEN_C:
            console.warn(payLoad)
            return { 
                ...state,
                screenC: {
                    ...payLoad
                }
            }

        default:
            return state
    }

}

