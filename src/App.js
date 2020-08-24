import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { loadLetters } from './store/storeActions'
import PacmanSpinner from './PacmanSpinner'
import './css/app.css'
import { Selector } from './Selector'

const mapStateToProps = letters => ({ letters })
const mapDispatchToProps = { loadLetters }

class App extends Component {
  componentDidMount() {
    this.props.loadLetters()
  }
  render() {
    if (!this.props.letters) {
      return <PacmanSpinner loading={true} />
    }
    return <div className="container">
      <div className="jumbotron">
        <div className='display-4'>Setareh &#9825;&#9825; Arthur&nbsp;</div>
      </div>
      <Router>
        <Route component={Selector} />
      </Router>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
