import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import SearchBox from '../containers/SearchBox.jsx'

import './nav.scss'

class Navbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: '',
      showNav: false,
      showSearchResults: false,
      showDropdown: false,
    }

    document.addEventListener('mousedown', (e) => this.handleSearchBoxClick(e))
  }

  handleSearchBoxClick (e) {
    const el = this.refs.search
    // this is usually null when the search box is not rendered (active)
    if (el == null) return

    const clickOnSearch = el.contains(e.srcElement)
    if (!clickOnSearch) {
      this.setState({ showSearchResults: false })
    }
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', (e) => this.handleSearchBoxClick(e))
  }

  toggleNav () {
    this.setState((prevState, props) => ({ showNav: !prevState.showNav }))
  }

  toggleDropdown () {
    this.setState((prevState, props) => ({ showDropdown: !prevState.showDropdown }))
  }

  handleQueryChange (e) {
    const value = e.target.value
    this.setState({ query: value })
  }

  logout = () => {
    this.props.logout()
  }

  render () {
    return (
      <nav className="nav">
      <div className="nav-left">
        <div className="nav-item">
          <Link to="/" className="title">Caena</Link>
        </div>
      </div>
      <div ref="search" className="nav-center">
        <SearchBox
          showSearchResults={ this.state.showSearchResults }
          handleOnFocus={ () => this.setState({ showSearchResults: true }) }
          handleQueryChange={ (e) => this.handleQueryChange(e) }
          query={ this.state.query }
        />
      </div>

      <span onClick={ () => this.toggleNav() } className={ 'nav-toggle' + (this.state.showNav ? ' is-active' : '') }>
        <span></span>
        <span></span>
        <span></span>
      </span>

      <div className={ 'overflow-initial nav-right nav-menu' + (this.state.showNav ? ' is-active' : '') }>
        <div className="nav-item">
          <div className="field is-grouped">
            <p className="control">
              <Link to="/recipes/add" className="button is-primary">Add Recipe</Link>
            </p>
          </div>
        </div>
        <NavLink activeClassName="is-active" to="/recipes" className="nav-item">Recipes</NavLink>
        <NavLink activeClassName="is-active" to="/cart" className="nav-item">Cart</NavLink>
        <div onClick={() => this.toggleDropdown() } className="nav-item user-profile">
          <img alt="user profile" className="user-profile-image" src="https://www.gravatar.com/avatar/ea7be1e5200ad6934add15a721b5b1b0?d=identicon"/>
          <svg aria-hidden="true" height="11" version="1.1" viewBox="0 0 12 16" width="8">
            <path d="M0 5l6 6 6-6z"></path>
          </svg>

          <div className={ 'dropdown ' + (this.state.showDropdown ? 'active' : '')}>
            <ul>
              <li>
                <Link to="/settings" className="nav-item">Settings</Link>
              </li>
              <li>
                <a onClick={ this.logout } className="nav-item">Logout</a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </nav>
    )
  }
}

export default Navbar