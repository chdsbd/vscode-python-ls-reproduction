import React from 'react'
import {
  Link
} from 'react-router-dom'

import NavLink from '../containers/NavLink.jsx'

class Navbar extends React.Component {
  state = {
    query: '',
    showDropdown: false
  }

  componentWillMount = () => {
    this.props.fetchData()
    document.addEventListener('click', this.handleGeneralClick)
  }

  componentWillUnmount = () => {
    document.removeEventListener('click', this.handleGeneralClick)
  }

  handleGeneralClick = e => {
    const clickedInComponent = this.element && this.element.contains(e.target)
    const clickedOnLink = e.target.nodeName === 'A'
    if (clickedInComponent && !clickedOnLink) return
    this.setState({ showDropdown: false })
  }

  render () {
    const {
      avatarURL,
      loggedIn = true,
      logout,
      email
    } = this.props

    const buttons = loggedIn ? (
      <div className="d-flex align-center p-relative">
        <NavLink
          to="/recipes/add"
          activeClassName="active"
          className="better-nav-item">
          Add Recipe
        </NavLink>
        <NavLink
          to="/recipes"
          activeClassName="active"
          className="better-nav-item">
          Recipes
        </NavLink>
        <NavLink
          to="/cart"
          activeClassName="active"
          className="better-nav-item">
          Cart
        </NavLink>
        <section ref={element => { this.element = element }}>
          <img
            onClick={ () => this.setState(prev => ({ showDropdown: !prev.showDropdown })) }
            alt=''
            className="user-profile-image better-nav-item p-0"
            src={ avatarURL }/>
          <div className={
            'box p-absolute direction-column align-items-start right-0 mt-1' + (this.state.showDropdown ? ' d-flex' : ' d-none')
          }>
            <p className="bold">{ email }</p>
            <div className="d-flex align-center p-1-0">
              <label className="d-flex align-items-center cursor-pointer">
            {/* TODO: handle change */}
                <input type='checkbox' className="mr-2"/>
                Dark Mode
              </label>
            </div>
            <Link to="/settings" className="p-1-0">Settings</Link>
            {/* TODO: add loading */}
            <button onClick={ logout } className="my-button w-100">Logout</button>
          </div>
        </section>
      </div>
    ) : (
      <div className="d-flex">
        <Link to="/login" className="better-nav-item">Login</Link>
        <Link to="/signup" className="better-nav-item">Signup</Link>
      </div>
    )

    return (
      <nav className="nav flex-wrap pt-2 pb-2">
        <Link to="/" className="better-nav-item pl-0 pr-0 fs-2rem fw-normal font-family-title">Recipe Yak</Link>
        { buttons }
      </nav>
    )
  }
}

export default Navbar
