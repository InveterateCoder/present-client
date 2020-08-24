import { CREATE, UPDATE, DELETE, LOAD } from './storeActions'

export const storeReducer = (state, action) => {
  switch (action.type) {
    case LOAD:
      return action.payload
    case CREATE:
      const letters = [...state]
      const date = new Date(action.payload.datetime)
      const index = letters.findIndex(l => new Date(l.datetime) < date)
      if (index < 0) letters.push(action.payload)
      else letters.splice(index, 0, action.payload)
      return letters
    case UPDATE:
      return state.map(letter => letter._id === action.payload._id ? action.payload : letter)
    case DELETE:
      return state.filter(letter => letter._id !== action.payload)
    default:
      return state
  }
}