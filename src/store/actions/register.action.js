import { HttpApi } from '../../config/Http'
import { changeLoading } from './loading.action'
import { changeNotify } from './notify.action'

export const actionTypes = {
    CHANGE: 'REGISTER_CHANGE',
    ERROR: 'REGISTER_ERROR',
    SUCCESS: 'REGISTER_SUCCESS'
}

export const change = (payLoad) => ({
    type: actionTypes.CHANGE,
    payLoad
})

export const errors = (payLoad) => ({
    type: actionTypes.ERROR,
    payLoad
})

export const success = (payLoad) => ({
    type: actionTypes.SUCCESS,
    payLoad
})

export const setUserToken = token => dispatch => {
    localStorage.setItem('access_token', token);
    dispatch( change({
        email: '',
        password: ''
    }) )

    dispatch(success(true))
}

export const register = data => dispatch => {
    dispatch(changeLoading({
        open: true,
        msg: 'Cadastrando usuário'
    }));

    return HttpApi.post('/register', data)
            .then(response => {
                dispatch(changeLoading({
                    open:false
                }))
                if (typeof response !== 'undefined') {
                   if (response.data.access_token) {
                        dispatch(changeNotify({
                            open:true,
                            class: 'success',
                            msg: 'Usuário cadastrado com sucesso'
                        }))

                        dispatch( setUserToken(response.data.access_token))
                   } 
                }
            })
            .catch(error => {                
                if (error.response) {
                    dispatch(changeLoading({open:false}))
                    
                    dispatch(changeNotify({
                        open:true,
                        class: 'error',
                        msg: 'Não foi possível cadastrar o usuário'
                    }))

                    dispatch(errors(error.response.data.errors))

                }
            })

}