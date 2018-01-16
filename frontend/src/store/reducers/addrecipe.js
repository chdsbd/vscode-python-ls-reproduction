import {
  SET_ADD_RECIPE_FORM_NAME,
  SET_ADD_RECIPE_FORM_AUTHOR,
  SET_ADD_RECIPE_FORM_SOURCE,
  SET_ADD_RECIPE_FORM_TIME,
  SET_ADD_RECIPE_FORM_SERVINGS,
  ADD_ADD_RECIPE_FORM_INGREDIENT,
  REMOVE_ADD_RECIPE_FORM_INGREDIENT,
  UPDATE_ADD_RECIPE_FORM_INGREDIENT,
  ADD_ADD_RECIPE_FORM_STEP,
  REMOVE_ADD_RECIPE_FORM_STEP,
  UPDATE_ADD_RECIPE_FORM_STEP,
  CLEAR_ADD_RECIPE_FORM
} from '../actionTypes'

const cart = (
  state = {
    name: '',
    author: '',
    source: '',
    time: '',
    servings: '',
    ingredients: [],
    steps: []
  }, action) => {
  switch (action.type) {
    case SET_ADD_RECIPE_FORM_NAME:
      return { ...state, name: action.val }
    case SET_ADD_RECIPE_FORM_AUTHOR:
      return { ...state, author: action.val }
    case SET_ADD_RECIPE_FORM_SOURCE:
      return { ...state, source: action.val }
    case SET_ADD_RECIPE_FORM_TIME:
      return { ...state, time: action.val }
    case SET_ADD_RECIPE_FORM_SERVINGS:
      return { ...state, servings: action.val }
    case ADD_ADD_RECIPE_FORM_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action.ingredient
        ]
      }
    case REMOVE_ADD_RECIPE_FORM_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((_, i) => i !== action.index)
      }
    case UPDATE_ADD_RECIPE_FORM_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.map((x, i) => {
          if (i === action.index) {
            return action.ingredient
          }
          return x
        })
      }
    case ADD_ADD_RECIPE_FORM_STEP:
      return {
        ...state,
        steps: [
          ...state.steps,
          action.step
        ]
      }
    case REMOVE_ADD_RECIPE_FORM_STEP:
      return {
        ...state,
        steps: state.steps.filter((_, i) => i !== action.index)
      }
    case UPDATE_ADD_RECIPE_FORM_STEP:
      return {
        ...state,
        steps: state.steps.map((x, i) => {
          if (i === action.index) {
            return action.step
          }
          return x
        })
      }
    case CLEAR_ADD_RECIPE_FORM:
      return {}
    default:
      return state
  }
}

export default cart