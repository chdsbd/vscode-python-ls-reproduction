from rest_framework import permissions

from django.shortcuts import get_object_or_404
from django.db.models import Q


from .models import Team, Membership, Recipe, MyUser


class IsTeamMember(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        team_pk = view.kwargs['team_pk']
        team = get_object_or_404(Team, pk=team_pk)
        return team.is_member(request.user)  # type: ignore


class IsTeamMemberIfPrivate(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        team_pk = view.kwargs['team_pk']
        team: Team = get_object_or_404(Team, pk=team_pk)
        return team.is_member(request.user) or (team.is_public and request.user)


class IsTeamAdmin(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        if view.basename == 'teams':
            team_pk = view.kwargs['pk']
        else:
            team_pk = view.kwargs['team_pk']
        team = get_object_or_404(Team, pk=team_pk)
        return (team.membership_set  # type: ignore
                .filter(level=Membership.ADMIN)
                .filter(user=request.user).exists())


class IsTeamAdminOrMembershipOwner(permissions.BasePermission):
    """
    Request is Admin the team or the membership object owner
    """
    def has_object_permission(self, request, view, membership: Membership) -> bool:
        if not isinstance(membership, Membership):
            raise TypeError('This permission only works for membership objects')
        object_owner = membership.user == request.user
        team_admin = membership.team.is_admin(request.user)
        return object_owner or team_admin  # type: ignore


class NonSafeIfMemberOrAdmin(IsTeamMember):
    def has_permission(self, request, view) -> bool:
        if request.method in permissions.SAFE_METHODS:
            return True
        team_pk = view.kwargs['team_pk']
        team = get_object_or_404(Team, pk=team_pk)
        return (team.membership_set  # type: ignore # https://github.com/python/mypy/issues/3448
                .filter(Q(level=Membership.ADMIN) | Q(level=Membership.CONTRIBUTOR))
                .filter(user=request.user).exists())


class HasRecipeAccess(permissions.BasePermission):
    """
    User is recipe owner or is a member of team with Recipe
    """
    def has_object_permission(self, request, view, recipe: Recipe) -> bool:
        return (recipe.owner == request.user if isinstance(recipe.owner, MyUser)  # type: ignore
                else recipe.owner.is_member(request.user))
