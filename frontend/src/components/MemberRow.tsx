import React from "react"

import { connect } from "react-redux"

import { ButtonPlain, ButtonDanger } from "@/components/Buttons"

import {
  settingUserTeamLevel,
  deletingMembership,
  Dispatch
} from "@/store/actions"
import { ITeam, IMember } from "@/store/reducers/teams"
import { RootState } from "@/store/store"
import { IUser } from "@/store/reducers/user"

const mapStateToProps = (
  state: RootState,
  { userID, teamID, membershipID }: IMemberRowProps
) => {
  const teams = state.teams as { [key: number]: ITeam }
  return {
    isUser: state.user.id === userID,
    deleting: teams[teamID].members[membershipID].deleting,
    userIsTeamAdmin: Object.values(teams[teamID].members)
      .filter(x => x.level === "admin")
      .some(({ user }) => user.id === state.user.id)
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleUserLevelChange: settingUserTeamLevel(dispatch),
  deleteMembership: deletingMembership(dispatch)
})

interface IMemberRowProps {
  readonly userID: IUser["id"]
  readonly teamID: ITeam["id"]
  readonly userIsTeamAdmin: boolean
  readonly membershipID: IMember["id"]
  readonly avatarURL: string
  readonly email: string
  readonly level: IMember["level"]
  readonly handleUserLevelChange: (
    teamID: ITeam["id"],
    membershipID: IMember["id"],
    level: string
  ) => void
  readonly deleteMembership: (
    teamID: ITeam["id"],
    membershipID: IMember["id"],
    leaving: boolean
  ) => void
  readonly isUser: boolean
  readonly isActive: IMember["is_active"]
  readonly deleting: IMember["deleting"]
}

const MemberRow = ({
  teamID,
  userIsTeamAdmin,
  membershipID,
  avatarURL,
  email,
  level,
  handleUserLevelChange,
  deleteMembership,
  isUser,
  isActive,
  deleting
}: IMemberRowProps) => (
  <tr key={membershipID}>
    <td className="d-flex align-items-center pr-4">
      <div className="w-50px mr-2 d-flex align-items-center">
        <img src={avatarURL} className="br-10-percent" alt="avatar" />
      </div>
      <div className="d-flex direction-column">
        <b>{email}</b>
      </div>
    </td>
    <td className="vertical-align-middle pr-4">
      {!isActive ? (
        <section className="d-flex align-items-start direction-column">
          <p className="bold">invite sent</p>
          <ButtonPlain className="is-small">Resend Invite</ButtonPlain>
        </section>
      ) : null}
    </td>
    <td className="vertical-align-middle pr-4">
      {userIsTeamAdmin ? (
        <div className="select is-small">
          <select
            value={level}
            onChange={e =>
              handleUserLevelChange(teamID, membershipID, e.target.value)
            }>
            <option value="admin">Admin</option>
            <option value="contributor">Contributor</option>
            <option value="read">Read</option>
          </select>
        </div>
      ) : (
        <p>
          <b>{level}</b>
        </p>
      )}
    </td>
    <td className="vertical-align-middle text-right">
      {isUser || userIsTeamAdmin ? (
        <ButtonDanger
          onClick={() => deleteMembership(teamID, membershipID, isUser)}
          loading={deleting}
          className="is-small">
          {isUser ? "leave" : "remove"}
        </ButtonDanger>
      ) : null}
    </td>
  </tr>
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberRow)