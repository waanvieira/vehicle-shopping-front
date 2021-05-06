// Lazy serve para não carregar todos os componentes de uma vez, só o que a gente chamar
import React, { Suspense, lazy } from 'react';
//Jogando o MenuItem para a variavel Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core'

const Auth = lazy(() => import('./view/auth'))
const Register = lazy(() => import('./view/register'))
const Vehicles = lazy(() => import('./view/vehicles'))
const VehicleEdit = lazy(() => import('./view/vehicles/edit'))

const Routes = () => (
    <Router>
        {/* Suspense serve para quando o componente estiver carregando
        podemos mostrar uma mensagem, um popup, um icone de carregando,
        Nesse caso vamos usar um ícone do material ui de progress */}
        <Suspense fallback={
            <div className="d-flex justify-content-center mt-5 pt-5">
                <CircularProgress />
            </div>
        }>
            <Switch>
                {/* Exact serve para permitir apenas a rota exata */}                
                <Route exact path="/vehicles" component={Vehicles}/>
                <Route exact path="/vehicles/create" component={VehicleEdit}/>
                <Route exact path="/vehicles/:id/edit" component={VehicleEdit}/>
                <Route exact path="/" component={Auth} />
                <Route exact path="/login" component={Auth} />
                <Route exact path="/register" component={Register} />
            </Switch>

        </Suspense>
    </Router>
)

export default Routes;