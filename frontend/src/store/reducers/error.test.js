import error from './error.js'
import {
  setErrorLogin,
  setErrorSignup,
  setErrorReset,
  setErrorAddRecipe,
  setErrorRecipes,
  setErrorCart,
} from '../actions.js'

describe('error', () => {
  it('sets login error', () => {
    const notErrorState = {
      login: false,
    }

    const errorState = {
      login: true,
    }

    expect(
      error(notErrorState, setErrorLogin(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorLogin(false))
      ).toEqual(notErrorState)
  })

  it('sets recipes error', () => {
    const notErrorState = {
      recipes: false,
    }

    const errorState = {
      recipes: true,
    }

    expect(
      error(notErrorState, setErrorRecipes(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorRecipes(false))
      ).toEqual(notErrorState)
  })

  it('sets signup error', () => {
    const notErrorState = {
      signup: false,
    }

    const errorState = {
      signup: true,
    }

    expect(
      error(notErrorState, setErrorSignup(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorSignup(false))
      ).toEqual(notErrorState)
  })

  it('sets addRecipe error', () => {
    const notErrorState = {
      addRecipe: false,
    }

    const errorState = {
      addRecipe: true,
    }

    expect(
      error(notErrorState, setErrorAddRecipe(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorAddRecipe(false))
      ).toEqual(notErrorState)
  })

  it('sets cart error', () => {
    const notErrorState = {
      cart: false,
    }

    const errorState = {
      cart: true,
    }

    expect(
      error(notErrorState, setErrorCart(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorCart(false))
      ).toEqual(notErrorState)
  })

  it('sets reset error', () => {
    const notErrorState = {
      reset: false,
    }

    const errorState = {
      reset: true,
    }

    expect(
      error(notErrorState, setErrorReset(true))
      ).toEqual(errorState)

    expect(
      error(errorState, setErrorReset(false))
      ).toEqual(notErrorState)
  })
})
