import React from 'react';
import { TextField, Typography, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux';
import { change, register } from '../../store/actions/register.action';
import { Redirect, Link } from 'react-router-dom';


export default function Register() {
    const dispatch = useDispatch()
    const { user, success, error } = useSelector(state => state.registerReducer)
    return (
        <div className="d-flex bg-white min-vh-100">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="form-group text-center">
                            <img src="/img/icon-master.svg" alt="CRM" height="50px" />
                            <Typography className="mt-3" variant="h6" component="h1">Se registre gratuitamente</Typography>
                        </div>

                        <TextField
                            error={error.name && true}
                            label="nome"
                            type="text"
                            margin="normal"
                            value={user.name}
                            onChange={text => {
                                dispatch(change({ name: text.target.value }));
                                if (error.name && delete error.name);                                
                                }}
                            />

                            {(error.name) &&
                                <strong className="text-danger">{error.name[0]}</strong>    
                            }

                        <TextField
                            error={error.email && true}
                            label="email"
                            type="email"
                            margin="normal"
                            autoComplete="email"
                            value={user.email}
                            onChange={text => {
                                dispatch(change({ email: text.target.value }));
                                if (error.email && delete error.email);
                            }}
                        />

                            {(error.email) &&
                                <strong className="text-danger">{error.email[0]}</strong>
                            }

                        <TextField
                            error={error.password && true}
                            label="password"
                            type="password"
                            margin="normal"
                            value={user.password}
                            onChange={text => {
                                dispatch(change({ password: text.target.value }));
                                if (error.password && delete error.password);
                            }}
                        />

                            {(error.password) &&
                                <strong className="text-danger">{error.password[0]}</strong>
                            }

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            className="my-4"
                            onClick={() => dispatch(register(user))}
                        >
                            Cadastrar
                        </Button>

                        <div className="text-center">
                            <Link to="/login" className="mt-4 text-danger">
                                Fazer Login
                            </Link>
                        </div>

                        {(success) &&
                            <Redirect to="/vehicles" />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
