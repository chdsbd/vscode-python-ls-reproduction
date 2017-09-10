import {
  SET_ERROR_LOGIN,
  SET_ERROR_SIGNUP,
  SET_ERROR_RESET,
} from '../actionTypes.js'

const defaultState = {
  login: false,
  signup: false,
  reset: false,
}

const error = (state = defaultState, action) => {
  switch (action.type) {
    case SET_ERROR_LOGIN:
      return { ...state, login: action.val }
    case SET_ERROR_SIGNUP:
      return { ...state, signup: action.val }
    case SET_ERROR_RESET:
      return { ...state, reset: action.val }
    default:
      return state
  }
}

export default error