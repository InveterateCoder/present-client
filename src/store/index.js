import { createStore, applyMiddleware } from 'redux'
import { storeReducer } from './storeReducer'
import apiMiddleware from './apiMiddleware'

export default createStore(storeReducer, applyMiddleware(apiMiddleware))