import {
  ADD_RECIPE,
  DELETE_RECIPE,
  ADD_STEP_TO_RECIPE,
  ADD_INGREDIENT_TO_RECIPE,
  UPDATE_RECIPE_NAME,
  DELETE_INGREDIENT,
  UPDATE_INGREDIENT,
  DELETE_STEP,
  UPDATE_RECIPE_SOURCE,
  UPDATE_RECIPE_AUTHOR,
  UPDATE_RECIPE_TIME,
  SET_RECIPES,
  UPDATE_STEP,
  SET_RECIPE_ADDING_TO_CART,
  SET_RECIPE_REMOVING_FROM_CART,
  SET_LOADING_ADD_STEP_TO_RECIPE,
  SET_LOADING_RECIPE,
  SET_DELETING_RECIPE,
  SET_ADDING_INGREDIENT_TO_RECIPE
} from '../actionTypes.js'

export const recipes = (state = {}, action) => {
  switch (action.type) {
    case ADD_RECIPE:
      return { ...state, [action.recipe.id]: action.recipe }
    case DELETE_RECIPE:
      return { ...state, [action.id]: undefined }
    case ADD_STEP_TO_RECIPE:
      return { ...state,
        [action.id]: {
          ...state[action.id],
          steps: [...state[action.id].steps, action.step]
        }
      }
    case SET_LOADING_ADD_STEP_TO_RECIPE:
      return { ...state,
        [action.id]: {
          ...state[action.id],
          addingStepToRecipe: action.val
        }
      }
    case ADD_INGREDIENT_TO_RECIPE:
      return { ...state,
        [action.id]: {
          ...state[action.id],
          ingredients: [...state[action.id].ingredients, action.ingredient]
        }
      }
    case UPDATE_RECIPE_NAME:
      return { ...state, [action.id]: { ...state[action.id], name: action.name } }
    case UPDATE_RECIPE_SOURCE:
      return { ...state, [action.id]: { ...state[action.id], source: action.source } }
    case UPDATE_RECIPE_TIME:
      return { ...state, [action.id]: { ...state[action.id], time: action.time } }
    case UPDATE_RECIPE_AUTHOR:
      return { ...state, [action.id]: { ...state[action.id], author: action.author } }
    case DELETE_INGREDIENT:
      return { ...state,
        [action.recipeID]: {
          ...state[action.recipeID],
          ingredients: state[action.recipeID].ingredients.filter(x => x.id !== action.ingredientID)
        }
      }
    case UPDATE_INGREDIENT:
      return { ...state,
        [action.recipeID]: {
          ...state[action.recipeID],
          ingredients: state[action.recipeID].ingredients.map(ingre => {
            if (ingre.id === action.ingredientID) {
              return { ...ingre, ...action.content }
            } else {
              return ingre
            }
          })
        }
      }
    case DELETE_STEP:
      return { ...state,
        [action.recipeID]: {
          ...state[action.recipeID],
          steps: state[action.recipeID].steps.filter(x => x.id !== action.stepID)
        }
      }
    case UPDATE_STEP:
      return { ...state,
        [action.recipeID]: {
          ...state[action.recipeID],
          steps: state[action.recipeID].steps.map(s => {
            if (s.id === action.stepID) {
              return { ...s, text: action.text }
            } else {
              return s
            }
          })
        }
      }
    case SET_RECIPES:
      // convert the array of objects to an object with the recipe.id as the
      // key, and the recipe as the value
      return action.recipes.reduce((a, b) => ({ ...a, [b.id]: b }), {})
    case SET_RECIPE_ADDING_TO_CART:
      return { ...state, [action.id]: { ...state[action.id], addingToCart: action.loading } }
    case SET_RECIPE_REMOVING_FROM_CART:
      return { ...state, [action.id]: { ...state[action.id], removingFromCart: action.loading } }
    case SET_DELETING_RECIPE:
      return { ...state, [action.id]: { ...state[action.id], deleting: action.val } }
    case SET_LOADING_RECIPE:
      return { ...state, [action.id]: { ...state[action.id], loading: action.val } }
    case SET_ADDING_INGREDIENT_TO_RECIPE:
      return { ...state, [action.id]: { ...state[action.id], addingIngredient: action.val } }
    default:
      return state
  }
}

export default recipes
