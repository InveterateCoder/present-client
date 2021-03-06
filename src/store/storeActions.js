export const LOAD = 'load'
export const CREATE = 'create'
export const UPDATE = 'update'
export const DELETE = 'delete'
export const CLEAR_STATE = 'clear'

export const loadLetters = () => ({
  type: LOAD,
})

export const createLetter = letter => ({
  type: CREATE,
  payload: letter
})

export const updateLetter = letter => ({
  type: UPDATE,
  payload: letter
})

export const deleteLetter = letterId => ({
  type: DELETE,
  payload: letterId
})

export const clearState = () => ({
  type: CLEAR_STATE
})