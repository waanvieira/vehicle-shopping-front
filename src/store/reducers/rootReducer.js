import { combineReducers } from 'redux'
import loadingReducer from './loading.reducer'
import notifyReducer from './notify.reducer'
import alertReducer from './alert.reducer'
import authReducer from './auth.reducer'
import registerReducer from './register.reducer'
import vehicleReducer from './vehicle.reducer'
import NavigationDuck from '../ducks/navigation'
import NotesDuck from '../ducks/notes'

const rootReducer = combineReducers({
    loadingReducer,
    notifyReducer,
    alertReducer,
    authReducer,
    registerReducer,
    vehicleReducer,
    NavigationDuck,
    NotesDuck
})

export default rootReducer;