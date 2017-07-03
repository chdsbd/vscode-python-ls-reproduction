import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Textarea from 'react-textarea-autosize'
import MarkdownIt from 'markdown-it'

import './recipe.scss'

import Navbar from './Nav.jsx'

const md = new MarkdownIt()

class Recipe extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editing: false,
      name: this.props.name,

      ingredients: this.props.ingredients,
      steps: this.props.steps,
      time: this.props.time,

      // Note: allows for the state to not be upated and for cancel to still work
      temp_ingredients: this.ingredients,
      temp_steps: this.steps,
      temp_time: this.time,
    }
  }

  toggleEdit () {
    this.setState(prevState => {
      return { editing: !prevState.editing }
    })
    console.log('toggleEdit to', this.state.editing)
  }

  handleChange (e) {
    this.setState({ ['temp_' + e.target.name]: e.target.value })
    console.log('handled change')
  }

  share () {
    console.log('share recipe')
  }

  saveData () {
    this.setState(
      {
        editing: false,
        steps: this.state.temp_steps,
        ingredients: this.state.temp_ingredients,
        time: this.state.temp_time,
      }
    )
    console.log('saved data')
  }

  render () {
    return (
      <div className="container">
        <Navbar/>
        <nav className="nav">
          <div className="nav-left">
            <Link to="/recipe" className="title is-1 nav-item">
              { this.state.name }
            </Link>
          </div>
        </nav>

        <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
                <h2 className="title">Ingredients</h2>
                <div className="card">
                  <div className="card-content">
                    <div className="content">
                      {
                        !this.state.editing
                        ? <div
                            className="content ingredients-list"
                            dangerouslySetInnerHTML={{ __html: md.render(this.state.ingredients) }}/>
                        : <Textarea
                            className="textarea"
                            onChange={ (e) => this.handleChange(e) }
                            placeholder="enter ingredients"
                            defaultValue={ this.state.ingredients }
                            name='ingredients'
                        />
                      }
                  </div>
                </div>
              </div>
            </div>

            <div className="column">
              <div className="recipe-subtitle">
                <h2 className="title is-3">Preperation</h2>
                  <div>
                  <input
                  onClick={ () => this.share() }
                  className="button is-info recipe-button"
                  type='button'
                  value='share'
                  name='share'/>
                  {
                  !this.state.editing &&
                    <input
                      className="button recipe-button"
                      onClick={ () => this.toggleEdit() }
                      type='button'
                      value='edit'
                      name='edit'/>
                }
                {

                  this.state.editing &&
                    <input
                      onClick={ () => this.saveData() }
                      className="button is-primary recipe-button"
                      type='button'
                      value='save'
                      name='save'/>
                }

                {
                  this.state.editing &&
                    <input
                      className="button is-link recipe-button"
                      onClick={ () => this.toggleEdit() }
                      type='button'
                      value='cancel'
                      name='cancel'/>
                }
                </div>
              </div>
                <div className="card">
                  <div className="card-content">
                    <div className="content">
                      {
                        this.state.time != null && !this.state.editing &&
                        <span>Time: { this.state.time }</span>
                      }
                      {
                        this.state.editing &&
                        <div>
                          <span>Time: </span>
                          <div>
                            <input
                              className="input"
                              onChange={ (e) => this.handleChange(e) }
                              type='text'
                              name='time'
                              defaultValue={ this.state.time }/>
                          </div>
                        </div>
                      }

                  {!this.state.editing
                    ? <div
                        className="content"
                        dangerouslySetInnerHTML={{ __html: md.render(this.state.steps) }}/>
                    : <Textarea
                        className="textarea"
                        onChange={ (e) => this.handleChange(e) }
                        placeholder="enter steps"
                        defaultValue={ this.state.steps }
                        name='steps'
                        />}
                    </div>
                  </div>
                </div>
            </div>
          </div>
          </div>
        </section>

        <footer>
          Caena ※ 2017
        </footer>

      </div>
    )
  }
}

Recipe.defaultProps = {
  name: 'Recipe Name',
  ingredients: '',
  steps: '',
  time: '',
}

Recipe.PropTypes = {
  name: PropTypes.string,
  ingredients: PropTypes.string,
  steps: PropTypes.string,
  time: PropTypes.string,
}

export default Recipe
