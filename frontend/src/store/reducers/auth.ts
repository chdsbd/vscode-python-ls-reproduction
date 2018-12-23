import { SET_FROM_URL } from "../actionTypes"
import { AnyAction } from "redux"

export interface IAuthState {
  readonly fromUrl: string
}

const initialState: IAuthState = {
  fromUrl: ""
}

const auth = (state: IAuthState = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_FROM_URL:
      return { ...state, fromUrl: action.val }
    default:
      return state
  }
}

export default auth