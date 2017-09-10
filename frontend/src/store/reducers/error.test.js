import error from './error.js'
import {
  setErrorLogin,
  setErrorSignup,
  setErrorReset,
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