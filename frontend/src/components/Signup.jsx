import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password1: '',
      password2: '',
    }
  }

  handleInputChange (e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSignup (e) {
    e.preventDefault()
    this.props.signup(this.state.email, this.state.password1, this.state.password2)
  }

  render () {
    const { loading } = this.props

    const validSignup =
      this.state.email !== '' &&
      this.state.password1 !== '' &&
      this.state.password2 !== ''

    return (
      <div className="container">
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-item">
              <Link to="/" className="title">Caena</Link>
            </div>
          </div>
        </nav>

        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-one-third is-offset-one-third box">
                <div className="tabs is-boxed">
                  <ul>
                    <li>
                      <Link to="/login"><span>Login</span></Link>
                    </li>
                    <li className="is-active">
                      <Link to="/signup"><span>Sign Up</span></Link>
                    </li>
                  </ul>
                </div>

                <form onSubmit={ e => this.handleSignup(e) }>
                  <div className="field">
                    <label className="label">Email</label>
                    <p className="control">
                      <input
                        onChange={ e => this.handleInputChange(e) }
                        className="input"
                        autoFocus
                        name="email"
                        type="email"
                        placeholder="rick.sanchez@me.com"/>
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="password1" className="label">Password</label>
                    <p className="control">
                      <input
                        onChange={ e => this.handleInputChange(e) }
                        className="input"
                        type="password"
                        name="password1"
                        id="password1"
                        placeholder="Super secret password."/>
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="password2" className="label">Password Again</label>
                    <p className="control">
                      <input
                        onChange={ e => this.handleInputChange(e) }
                        className="input"
                        type="password"
                        name="password2"
                        id="password2"
                        placeholder="Enter your password again."/>
                    </p>
                  </div>

                  { !!this.props.error &&
                    <p className="help is-danger">Error with signup</p>
                  }

                  <div className="field flex-space-between">
                    <p className="control">
                      <button
                        type="submit"
                        disabled={ !validSignup }
                        className={ 'button is-primary ' + (loading ? 'is-loading' : '')}>
                        Submit
                      </button>

                    </p>
                    <Link to="/password-reset" className="button is-link">Forgot Password?</Link>
                  </div>

                  </form>
              </div>
            </div>
          </div>
        </section>
      </div>)
  }
}

Signup.PropTypes = {
  loading: PropTypes.bool.isRequired,
  signup: PropTypes.func.isRequired,
}

export default Signup