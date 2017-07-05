import recipes from './recipes.js'

describe('Recipes', () => {
it('Adds recipe to recipe list', () => {
  const beforeState = {
    1: {},
  }
  const recipe = {
    id: 123,
    title: 'Recipe title',
    tags: ['tagOne', 'tagTwo'],
    author: 'Recipe author',
    source: '',
    ingredients: ['ingredientOne', 'ingredientTwo'],
  }
  const afterState = {
    123: recipe,
    1: {},
  }
  expect(
    recipes(beforeState, {type: 'ADD_RECIPE', recipe})
    ).toEqual(afterState)
})

it('Remove recipe from recipe list', () => {
  const beforeState = {
    123: {},
    1: {},
  }
  const afterState = {
    1: {},
  }
  expect(
    recipes(beforeState, {type: 'REMOVE_RECIPE', id:123})
    ).toEqual(afterState)
})

it('Remove non-existent recipe from recipe list', () => {
  expect(
    recipes({}, {type: 'REMOVE_RECIPE', id:123})
    ).toEqual({})
})
})
