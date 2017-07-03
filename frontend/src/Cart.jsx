import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Nav.jsx'
import Recipe from './RecipeItem.jsx'
import './cart.scss'
import { observer, inject } from 'mobx-react'

const Cart = inject('store')(observer(props => {
  const recipeItems = props.store.cart.map(recipe =>
    <Recipe
      key={ recipe.id }
      title={ recipe.title }
      url={ recipe.url }
      author={ recipe.author }
      source={ recipe.source }
      removeFromCart={ () => props.store.removeFromCart(recipe.id)}
      addToCart={ () => props.store.addToCart(recipe.id)}
      tags={ recipe.tags }
      inCart={ recipe.inCart }/>)
  const ingredients = props.store.cart.map(recipe => [recipe.ingredients, recipe.id])
  const ingredientList = ingredients.map((ingredient, id) => <li key={id}>{ingredient}</li>)
  return (
    <div className="container">
      <Navbar/>
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h2 className="title">Recipes</h2>
              { recipeItems }
            </div>
            <div className="column">
              <h2 className="title">
                <Link to="/ingredients">Shopping List</Link>
              </h2>
              <div className="card">
                <ul className="ingredients-list card-content">
                  { ingredientList }
                </ul>
                <pre>{ JSON.stringify(props.store.recipes, null, 2)}</pre>
                <pre>{ JSON.stringify(props.store.cart, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}))

export default Cart