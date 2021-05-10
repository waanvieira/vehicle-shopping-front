// Colocando change_loading para não ter conflito em cada tipo de ação
export const actionTypes = {
    CHANGE: 'CHANGE_ALERT'
}

export const changeAlert = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})