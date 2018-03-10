import {
  ADD_TEAM,
  SET_LOADING_TEAM,
  SET_LOADING_TEAM_MEMBERS,
  SET_LOADING_TEAM_INVITES,
  SET_TEAM_404,
  SET_TEAM_MEMBERS,
  SET_TEAM_INVITES,
  SET_LOADING_TEAM_RECIPES,
  SET_TEAM_RECIPES,
  SET_DELETING_MEMBERSHIP,
  DELETE_MEMBERSHIP,
  SET_UPDATING_MEMBERSHIP,
  SET_UPDATING_USER_TEAM_LEVEL,
  SET_USER_TEAM_LEVEL,
} from '../actionTypes'

export const teams = (state = {}, action) => {
  switch (action.type) {
  case ADD_TEAM:
    return { ...state, [action.team.id]: action.team }
  case SET_LOADING_TEAM:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        loadingTeam: action.loadingTeam
      }
    }
  case SET_LOADING_TEAM_MEMBERS:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        loadingMembers: action.loadingMembers
      }
    }
  case SET_LOADING_TEAM_INVITES:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        loadingInvites: action.loadingInvites
      }
    }
  case SET_LOADING_TEAM_RECIPES:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        loadingRecipes: action.loadingRecipes
      }
    }
  case SET_TEAM_404:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        error404: action.val
      }
    }
  case SET_TEAM_MEMBERS:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        members: action.members.reduce((a, b) => ({
          ...a,
          [b.id]: b
        }), {})
      }
    }
  case SET_TEAM_INVITES:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        invites: action.invites.reduce((a, b) => ({
          ...a,
          [b.id]: b
        }), {})
      }
    }
  case SET_TEAM_RECIPES:
    return {
      ...state,
      [action.id]: {
        ...state[action.id],
        recipes: action.recipes.map(({ id }) => id)
      }
    }
  case SET_UPDATING_MEMBERSHIP:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          updating: action.val,
        }
      }
  case SET_UPDATING_USER_TEAM_LEVEL:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          updating: action.updating,
        }
      }
  case SET_DELETING_MEMBERSHIP:
      // TODO: fix this, deleting should go with the membership, not the team
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          deleting: action.val,
        }
      }
  case SET_USER_TEAM_LEVEL:
      return {
        ...state,
        [action.teamID]: {
          ...state[action.teamID],
          // TODO: refactor membership into it's own reducer
          members: {
            ...state[action.teamID].members,
            [action.membershipID]: {
              ...state[action.teamID].members[action.membershipID],
              level: action.level,
            }
          }
        }
      }
  case DELETE_MEMBERSHIP:
      // TODO: make this work
      return { ...state, [action.id]: undefined }
  default:
    return state
  }
}

export default teams
