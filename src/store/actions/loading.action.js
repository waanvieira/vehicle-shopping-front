// Colocando change_loading para não ter conflito em cada tipo de ação
export const actionTypes = {
    CHANGE: 'CHANGE_LOADING'
}

export const changeLoading = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})