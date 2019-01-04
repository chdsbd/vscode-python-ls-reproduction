import React from "react"
import { Route, Switch, Redirect, RouteProps } from "react-router-dom"
import { ConnectedRouter } from "react-router-redux"
import { Helmet } from "@/components/Helmet"
import HTML5Backend from "react-dnd-html5-backend"
import { DragDropContext } from "react-dnd"
import { connect } from "react-redux"
import { history, RootState } from "@/store/store"
import Home from "@/containers/Home"
import Login from "@/containers/Login"
import Signup from "@/containers/Signup"
import NoMatch from "@/components/NoMatch"
import Recipe from "@/components/Recipe"
import PasswordReset from "@/containers/PasswordReset"
import Settings from "@/containers/Settings"
import Team from "@/containers/Team"
import TeamInvite from "@/components/TeamInvite"
import TeamCreate from "@/components/TeamCreate"
import AddRecipe from "@/containers/AddRecipe"
import Notification from "@/containers/Notification"
import { Container, ContainerBase } from "@/components/Base"
import PasswordChange from "@/containers/PasswordChange"
import PasswordSet from "@/containers/PasswordSet"
import PasswordResetConfirmation from "@/components/PasswordResetConfirmation"
import OAuth from "@/containers/OAuth"
import OAuthConnect from "@/containers/OAuthConnect"
import Schedule from "@/components/Schedule"
import HelpMenuModal from "@/components/HelpMenuModal"
import Recipes from "@/components/Recipes"
import ErrorBoundary from "@/components/ErrorBoundary"

import "@/components/scss/main.scss"

interface IAuthRouteProps extends RouteProps {
  readonly authenticated: boolean
}

const mapAuthenticated = (state: RootState) => ({
  authenticated: state.user.loggedIn
})

const PrivateRoute = connect(mapAuthenticated)(
  ({ component: Component, authenticated, ...rest }: IAuthRouteProps) => {
    if (Component == null) {
      return null
    }
    return (
      <Route
        {...rest}
        render={props => {
          return authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }}
      />
    )
  }
)

const PublicOnlyRoute = connect(mapAuthenticated)(
  ({ component: Component, authenticated, ...rest }: IAuthRouteProps) => {
    if (Component == null) {
      return null
    }
    return (
      <Route
        {...rest}
        render={props => {
          return !authenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
        }}
      />
    )
  }
)

function Base() {
  return (
    <ErrorBoundary>
      <Helmet defaultTitle="Recipe Yak" titleTemplate="%s | Recipe Yak" />
      <ConnectedRouter history={history}>
        <Switch>
          <PublicOnlyRoute exact path="/login" component={Login} />
          <PublicOnlyRoute exact path="/signup" component={Signup} />
          <Route exact path="/password-reset" component={PasswordReset} />
          <Route
            exact
            path="/accounts/:service(gitlab|github)"
            component={OAuth}
          />
          <ContainerBase>
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute
                exact
                path="/schedule/:type(shopping|recipes)?"
                component={Schedule}
              />
              <PrivateRoute
                exact
                path="/t/:id(\d+)(.*)/schedule/:type(shopping|recipes)?"
                component={Schedule}
              />
              <Container>
                <Switch>
                  <Route
                    exact
                    path="/accounts/:service(gitlab|github)/connect"
                    component={OAuthConnect}
                  />
                  <Route
                    exact
                    path="/password-reset/confirm/:uid([0-9A-Za-z_\-]+).:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})"
                    component={PasswordResetConfirmation}
                  />
                  <PrivateRoute
                    exact
                    path="/recipes/add"
                    component={AddRecipe}
                  />
                  <PrivateRoute exact path="/recipes/" component={Recipes} />
                  <PrivateRoute
                    exact
                    path="/recipes/:id(\d+)(.*)"
                    component={Recipe}
                  />
                  <PrivateRoute exact path="/settings" component={Settings} />
                  <PrivateRoute
                    exact
                    path="/password"
                    component={PasswordChange}
                  />
                  <PrivateRoute
                    exact
                    path="/password/set"
                    component={PasswordSet}
                  />
                  <Route exact path="/t/create" component={TeamCreate} />
                  <Route
                    exact
                    path="/t/:id(\d+)(.*)/invite"
                    component={TeamInvite}
                  />
                  <Route
                    exact
                    path="/t/:id(\d+)(.*)/settings"
                    component={Team}
                  />
                  <Route exact path="/t/:id(\d+)(.*)" component={Team} />
                  <Route component={NoMatch} />
                </Switch>
              </Container>
            </Switch>
          </ContainerBase>
        </Switch>
      </ConnectedRouter>
      <Notification />
      <HelpMenuModal />
    </ErrorBoundary>
  )
}

export default DragDropContext(HTML5Backend)(Base)
