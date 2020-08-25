import { CREATE, UPDATE, DELETE, LOAD, CLEAR_STATE } from './storeActions'

export const storeReducer = (state, action) => {
  switch (action.type) {
    case LOAD:
      return {
        letters: action.payload,
        dirty: false
      }
    case CREATE:
      const letters = [...state.letters]
      const date = new Date(action.payload.datetime)
      const index = letters.findIndex(l => new Date(l.datetime) < date)
      if (index < 0) letters.push(action.payload)
      else letters.splice(index, 0, action.payload)
      return {
        letters,
        dirty: true
      }
    case UPDATE:
      return {
        letters: state.letters.map(letter => letter._id === action.payload._id ? action.payload : letter),
        dirty: true
      }
    case DELETE:
      return {
        letters: state.letters.filter(letter => letter._id !== action.payload),
        dirty: true
      }
    case CLEAR_STATE:
      return {
        letters: state.letters,
        dirty: false
      }
    default:
      return state
  }
}