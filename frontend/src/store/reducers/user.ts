import {
  LOG_IN,
  SET_AVATAR_URL,
  SET_USER_EMAIL,
  SET_ERROR_USER,
  SET_LOADING_USER,
  SET_SOCIAL_ACCOUNT_CONNECTIONS,
  SET_USER_STATS,
  SET_LOADING_USER_STATS,
  SET_UPDATING_USER_EMAIL,
  SET_PASSWORD_USABLE,
  SET_LOGGING_OUT,
  TOGGLE_DARK_MODE,
  SET_SOCIAL_ACCOUNT_CONNECTION,
  SET_USER_ID,
  SET_USER_LOGGED_IN,
  SET_SCHEDULE_URL
} from "../actionTypes"

import { socialAccounts, ISocialAccountsState } from "./socialAccounts"

import { setDarkModeClass } from "../../sideEffects"

import raven from "raven-js"

export interface IUser {
  readonly avatar_url: string
  readonly email: string
  readonly id: number
  readonly has_usable_password?: boolean
}

export type SocialProvider = "github" | "gitlab"
export interface ISocialConnection {
  readonly id: number | null
  readonly provider: SocialProvider
  readonly uid?: string
  readonly last_login?: string
  readonly date_joined?: string
}

interface IUserState {
  readonly id: null | number
  readonly loggedIn: boolean
  readonly avatarURL: string
  readonly email: string
  readonly loading: boolean
  readonly error: boolean
  readonly stats: unknown
  readonly stats_loading: boolean
  readonly loggingOut: boolean
  readonly darkMode: boolean
  readonly hasUsablePassword: boolean
  readonly socialAccountConnections: ISocialAccountsState
  readonly scheduleURL: string
}

const initialState: IUserState = {
  id: null,
  loggedIn: false,
  avatarURL: "",
  email: "",
  loading: false,
  error: false,
  stats: {},
  stats_loading: false,
  loggingOut: false,
  darkMode: false,
  hasUsablePassword: false,
  socialAccountConnections: {
    github: null,
    gitlab: null
  },
  scheduleURL: "/schedule/"
}

export const user = (state: IUserState = initialState, action: any) => {
  switch (action.type) {
    case LOG_IN:
      raven.setUserContext({
        ...{
          email: state.email,
          id: state.id
        },
        email: action.user.email,
        id: action.user.id
      })
      return {
        ...state,
        avatarURL: action.user.avatar_url,
        email: action.user.email,
        id: action.user.id,
        loggedIn: true,
        hasUsablePassword: action.user.has_usable_password
      }
    case SET_AVATAR_URL:
      return { ...state, avatarURL: action.url }
    case SET_USER_EMAIL:
      return { ...state, email: action.email }
    case SET_LOADING_USER:
      return { ...state, loading: action.val }
    case SET_ERROR_USER:
      return { ...state, error: action.val }
    case SET_USER_STATS:
      return { ...state, stats: action.val }
    case SET_LOADING_USER_STATS:
      return { ...state, stats_loading: action.val }
    case SET_UPDATING_USER_EMAIL:
      return { ...state, updatingEmail: action.val }
    case SET_LOGGING_OUT:
      raven.setUserContext()
      return { ...state, loggingOut: action.val }
    case SET_PASSWORD_USABLE:
      return { ...state, hasUsablePassword: action.val }
    case SET_SOCIAL_ACCOUNT_CONNECTIONS:
    case SET_SOCIAL_ACCOUNT_CONNECTION:
      return {
        ...state,
        socialAccountConnections: socialAccounts(
          state.socialAccountConnections,
          action
        )
      }
    case SET_USER_LOGGED_IN:
      return { ...state, loggedIn: action.val }
    case TOGGLE_DARK_MODE:
      const newDarkMode = !state.darkMode
      setDarkModeClass(newDarkMode)
      return { ...state, darkMode: newDarkMode }
    case SET_USER_ID:
      return { ...state, id: action.id }
    case SET_SCHEDULE_URL:
      return { ...state, scheduleURL: action.scheduleURL }
    default:
      return state
  }
}

export default user