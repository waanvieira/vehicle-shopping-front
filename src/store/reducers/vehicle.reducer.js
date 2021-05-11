import { actionTypes } from '../actions/vehicle.action'

const initialState = {
    vehicles: {
        data: []
    },
    vehicle: {},
    brand: [],
    model: [],
    version: [],
    upload_photo: false,
    success: false,
    error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, { type, payLoad, isLoadMore }) => {    
    switch (type) {        
        case actionTypes.INDEX:
            if (isLoadMore) {                
                //isLoadMOre quando tem paginação, aqui estamos concatenando os dados retornados
                //da nossa api
                payLoad.vehicles.data = state.vehicles.data.concat(payLoad.vehicles.data)
            }
            
            return { ...state, ...payLoad }

        case actionTypes.DESTROY:
            return {
                ...state,
                vehicles: {
                    ...state.vehicles,
                    data: state.vehicles.data.filter(item => item.id !== payLoad)
                }
            }

        case actionTypes.CHANGE:
            
            return {
                ...state,
                vehicle: {
                    ...state.vehicle,
                    ...payLoad
                }
            }

        case actionTypes.UPLOAD_PHOTO:            
            return {
                ...state,
                vehicle: {
                    ...state.vehicle,
                    photos: [
                        ...state.vehicle.photos.concat(payLoad)
                    ]
                }
            }
        case actionTypes.DELETE_PHOTO:
            return {
                ...state,
                vehicle: {
                    ...state.vehicle,
                    photos: [
                        ...state.vehicle.photos.filter(item => item.uuid !== payLoad)
                    ]
                }
            }
        case actionTypes.REORDER_PHOTO:
                return {
                    ...state,
                    vehicle: {
                        ...state.vehicle,
                        photos: payLoad
                    }
                }
        case actionTypes.SUCCESS:
            return {
                ...state,
                success: payLoad
            }

        case actionTypes.ERROR:
            return {
                ...state,
                error: payLoad
            }

        default:
            return state
    }

}