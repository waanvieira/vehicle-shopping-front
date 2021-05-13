import { HttpApi, HttpAuth, HttpUpload } from "../../config/Http"
import { changeLoading } from "./loading.action"
import { changeNotify } from "./notify.action"

export const actionTypes = {
    INDEX: 'VEHICLE_INDEX',
    DESTROY: 'VEHICLE_DESTROY',
    CHANGE: 'VEHICLE_CHANGE',
    SUCCESS: 'VEHICLE_SUCCESS',
    ERROR: 'VEHICLE_ERROR', 
    UPLOAD_PHOTO: 'VEHICLE_UPLOAD_PHOTO',
    DELETE_PHOTO: 'VEHICLE_DELETE_PHOTO',
    REORDER_PHOTO: 'VEHICLE_REORDER_PHOTO',
}

export const change = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})

export const error = (payLoad) => ({
    type: actionTypes.ERROR,
    payLoad
})

export const success = (payLoad) => ({
    type: actionTypes.SUCCESS,
    payLoad
})

export const indexResponse = (payLoad, isLoadMore) => ({
    type: actionTypes.INDEX,
    payLoad,
    isLoadMore
})

export const index = (query, isLoadMore) => dispatch => {    
    return HttpAuth.get('vehicles?' + new URLSearchParams(query))
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data, isLoadMore)))
        .catch(error => {            
            if (error.response) {
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Não foi possível listar os veículos'
                }))

                dispatch(error(error.response.data.errors))
            }
        })
}

export const store = () => dispatch => {
    return HttpAuth.post('vehicles')
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)))
    // .catch(error => {
    //     if (error.response) {
    //         dispatch(changeNotify({
    //             open: true,
    //             class: 'error',
    //             msg: 'Não foi possível listar os veículos'
    //         }))

    //         dispatch(error(error.response.data.errors))
    //     }
    // })
}

export const update = (data) => dispatch => {    
    dispatch(changeLoading({
        open: true,
        msg: 'Atualizando veículo'
    }))

    return HttpAuth.put(`vehicles/update/${data.uuid}`, data)
        .then(response => {
            dispatch(changeLoading({ open: false }))            
            if (typeof response !== 'undefined') {
                if (response.data.error) {
                    dispatch(success(false))
                    dispatch(error(response.data.error))
                }

                if (response.data.status === 200) {
                    dispatch(success(true))
                }
            }

        })
}

export const show = (id) => dispatch => {    
    return HttpAuth.get(`vehicles/show/${id}`)
        .then(response => typeof response !== 'undefined' && dispatch(indexResponse(response.data)))
}

export const destroyResponse = (payLoad) => ({
    type: actionTypes.DESTROY,
    payLoad
})

export const destroy = (data) => dispatch => {
    return HttpAuth.delete(`vehicles/destroy/${data.uuid}`)
        .then(response => {
            if (response.data.status === 200) {
                dispatch(destroyResponse(data.id))
            }

        })
        .catch(error => {
            if (error.response) {
                dispatch(changeNotify({
                    open: true,
                    class: 'error',
                    msg: 'Não foi possível deletar veículo'
                }))

                dispatch(error(error.response.data.errors))
            }
        })
}

export const cep = (zipCode) => dispatch => {
    if (zipCode.length > 8) {
        return HttpApi.post('/webservice/cep', {
            cep: zipCode
        }).then(response => {            
            if (typeof response !== 'undefined') {

                dispatch(change(response.data))
                
                if (response.data.zipcode === '') {
                    dispatch(changeNotify({
                        open: true,
                        msg: 'CEP não encontrado',
                        class: 'error'
                    }))
                }                
            }
        })
    }
}

export const brand = (type) => dispatch => {
    dispatch(changeLoading({ open: true }))
    return HttpAuth.get(`vehicles/${type}/brand`)
        .then(response => {
            dispatch(changeLoading({ open: false }))
            if (typeof response !== 'undefined') {                
                dispatch(indexResponse(response.data))
            }
        })
}

export const model = (type, brand) => dispatch => {
    dispatch(changeLoading({ open: true }))
    return HttpAuth.get(`vehicles/${type}/${brand}/model`)
        .then(response => {
            dispatch(changeLoading({ open: false }))
            if (typeof response !== 'undefined') {
                dispatch(indexResponse(response.data))
            }
        })
}

export const version = (brand, model) => dispatch => {    
    dispatch(changeLoading({ open: true }))
    return HttpAuth.get(`vehicles/${brand}/${model}/version`)
        .then(response => {
            dispatch(changeLoading({ open: false }))
            if (typeof response !== 'undefined') {
                dispatch(indexResponse(response.data))
            }
        })
}

export const uploadPhotoResponse = (payLoad) => ({
    type: actionTypes.UPLOAD_PHOTO,
    payLoad
})

export const uploadPhoto = (item) => dispatch => {    
    dispatch(indexResponse({upload_photo: true}))
    
    return HttpUpload.post('vehicles/photo', item)
    .then(response => {
        dispatch(indexResponse({upload_photo:false}))
        
        if (typeof response !== 'undefined') {
            dispatch(indexResponse(response.data))
            
            if (response.data.error) {
                dispatch(changeNotify({
                    open: true,
                    msg: response.data.error,
                    class: 'error'
                }))                
            }

            if (response.data) {                
                dispatch(uploadPhotoResponse(response.data));
            }
        }
    })
}

export const deletePhotoResponse = (payLoad) => ({
    type:actionTypes.DELETE_PHOTO,
    payLoad
})

export const deletePhoto = (id) => dispatch => {
    
    return HttpAuth.delete(`vehicles/photo/${id}`)
    .then(response => {        
        if (typeof response !== 'undefined') {
            if (response.data.error) {
                dispatch(changeNotify({
                    open: true,
                    msg: response.data.error,
                    class: 'error'
                }))              
            }

            if (response.data) {                
                dispatch(deletePhotoResponse(id));
            }
        }
    })
    .catch(error => {
        if (error.response) {
            dispatch(changeNotify({
                open: true,
                class: 'error',
                msg: 'Não foi possível aagar a foto'
            }))

            dispatch(error(error.response.data.errors))
        }
    })
}

export const reorderPhotoResponse = (payLoad) => ({
    type:actionTypes.REORDER_PHOTO,
    payLoad
})

export const reorderPhoto = (position, data) => dispatch => {
    dispatch(reorderPhotoResponse(data));    
    return HttpAuth.put('vehicles/photo/null', position)
        .then(response => {
            if (typeof resposne !== 'undefined') {
                if (response.data.success) {
                    dispatch(changeNotify({
                        open: true,
                        msg: response.data.success,
                        class: 'success'
                    }))
                }
            }
        })
}