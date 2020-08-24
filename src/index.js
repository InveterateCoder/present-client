import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import dataStore from './store'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './css/index.css'

ReactDOM.render(
  <Provider store={dataStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
