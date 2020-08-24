import { LOAD, CREATE, DELETE, UPDATE } from './storeActions'
import urls from '../urls'

function request(next, action, method) {
  let token = sessionStorage.getItem('love_token')
  if (!token && method !== 'GET') {
    alert('Something went terribly wrong. Please, try again later.')
    return
  }
  token = 'Bearer ' + token

  const url = urls[method] + (method === 'DELETE' ? '/' + action.payload : '')
  const body = method === 'POST' || method === 'PUT' ? JSON.stringify(action.payload) : undefined
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body,
  }).then(res => {
    if (res.status === 200) {
      if (method === 'GET' || method === 'POST') {
        res.json().then(data => {
          action.payload = data
          next(action)
        })
      } else next(action)
    } else {
      throw new Error('Request has failed.')
    }
  }).catch(() => {
    alert('Something went terribly wrong. Please, try again later.')
  })
}

export default () => next => action => {
  switch (action.type) {
    case LOAD:
      request(next, action, 'GET')
      break;
    case CREATE:
      request(next, action, 'POST')
      break;
    case UPDATE:
      request(next, action, 'PUT')
      break;
    case DELETE:
      request(next, action, 'DELETE')
      break;
  }
}