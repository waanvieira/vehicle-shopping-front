import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
// import { Button, TextField, Select } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { MdPayment } from 'react-icons/md'
import Routes from './Routes';
import { Loading, Notify, Alert } from './view/components'
import './global.css'
import Navigation from './view/navigation';

const theme = createMuiTheme ({
    palete: {
          primary: {
          main: blue[500]
      },
    },
    props: {
      MuiTextField: {
        variant: 'outlined',
        fullWidth: true,
      },
      MuiSelect: {
        variant: 'outlined',
        fullWidth: true,
      }
    }
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>      
      <Alert />
      <Notify />
      <Loading />
      <Routes />
      <Navigation />
    </ThemeProvider>
  </Provider>
)

export default App;
