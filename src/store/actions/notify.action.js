// Colocando change_loading para não ter conflito em cada tipo de ação
export const actionTypes = {
    CHANGE: 'CHANGE_NOTIFY'
}

export const changeNotify = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})