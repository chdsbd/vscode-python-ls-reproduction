import React from "react"
import { connect } from "react-redux"

import RecipeItem from "@/components/RecipeItem"
import Loader from "@/components/Loader"
import { TextInput } from "@/components/Forms"
import { matchesQuery } from "@/search"
import Results from "@/components/Results"

import { byNameAlphabetical } from "@/sorters"

import { fetchRecipeList, Dispatch } from "@/store/actions"
import { IRecipe } from "@/store/reducers/recipes"
import { ITeam } from "@/store/reducers/teams"
import { RootState } from "@/store/store"

const mapStateToProps = (state: RootState) => {
  return {
    recipes: Object.values(state.recipes).sort(byNameAlphabetical),
    loading: state.loading.recipes
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchData: fetchRecipeList(dispatch)
})

interface IRecipesProps {
  readonly fetchData: (teamID: ITeam["id"] | "personal") => void
  readonly recipes: IRecipe[]
  readonly loading: boolean
  readonly teamID: ITeam["id"]
  readonly scroll: boolean
  readonly drag: boolean
}

interface IRecipesState {
  readonly query: string
}

class Recipes extends React.Component<IRecipesProps, IRecipesState> {
  state: IRecipesState = {
    query: ""
  }

  componentWillMount() {
    const teamID = this.props.teamID == null ? "personal" : this.props.teamID
    this.props.fetchData(teamID)
  }

  handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.target.value })
  }

  render() {
    const results: JSX.Element[] = this.props.recipes
      .filter(recipe => matchesQuery(recipe, this.state.query))
      .map(recipe => (
        <RecipeItem
          {...recipe}
          teamID={this.props.teamID}
          drag={this.props.drag}
          key={recipe.id}
        />
      ))

    const scrollClass = this.props.scroll ? "recipe-scroll" : ""
    return (
      <div>
        <TextInput
          onChange={this.handleQueryChange}
          placeholder="search • optionally prepended a tag, 'author:' 'name:' 'ingredient:"
        />

        {this.props.loading ? (
          <Loader className="pt-4" />
        ) : (
          <div className={scrollClass}>
            <div className="recipe-grid pt-4">
              <Results recipes={results} query={this.state.query} />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recipes)