import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Letter } from './Letter'
import { Paginator } from './Paginator'
import escapeRegex from 'escape-string-regexp'

const domParser = new DOMParser()

function test(text, search) {
  const testPat = RegExp(escapeRegex(search), 'i')
  const doc = domParser.parseFromString(text, 'text/html')
  for (let node of doc.body.childNodes) {
    if (testPat.test(node.textContent)) {
      return true
    }
  }
  return false
}
function replace(text, search) {
  const testPat = RegExp(escapeRegex(search), 'i')
  const replacePat = RegExp(escapeRegex(search), 'gi')
  const doc = domParser.parseFromString(text, 'text/html')
  for (let node of doc.body.childNodes) {
    if (testPat.test(node.textContent)) {
      node.innerHTML = node.textContent.replace(replacePat, '<span class="bg-warning">$&</span>')
    }
  }
  return doc.body.innerHTML
}

const LETTERS_PER_PAGE = 5

const mapStateToProps = letters => ({ letters })

export const Book = connect(mapStateToProps)(
  class extends Component {
    static getDerivedStateFromProps(props, state) {
      const page = Number(props.match.params.page)
      if (Number.isNaN(page)) return null
      const urlSearch = new URLSearchParams(props.location.search)
      const search = urlSearch.get('search')
      let date = urlSearch.get('date')
      if (date) date = new Date(date)
      let letters = props.letters.filter(l => {
        const letDate = new Date(l.datetime)
        if ((!date || (date.getFullYear() === letDate.getFullYear()
          && date.getMonth() === letDate.getMonth()
          && date.getDate() === letDate.getDate()))
          && (!search || test(l.text, search))) {
          return true
        }
        return false
      })
      const total = Math.ceil(letters.length / LETTERS_PER_PAGE) || 1
      if (page > total || page < 1)
        return null
      if (state.page !== page || state.total !== total || state.letters !== letters) {
        letters = letters.slice((page - 1) * LETTERS_PER_PAGE, page * LETTERS_PER_PAGE)
        letters.forEach(l => {
          if (search) {
            l.altText = replace(l.text, search)
          } else {
            delete l.altText
          }
        })
        return {
          page,
          total,
          letters
        }
      } else return null
    }
    constructor(props) {
      super(props)
      this.state = {
        page: 0,
        total: 0,
        letters: []
      }
    }
    getDate(datetime) {
      let date = new Date(datetime)
      let year = date.getFullYear()
      let month = (date.getMonth() + 1).toString()
      if (month.length === 1) month = '0' + month
      let day = date.getDate().toString()
      if (day.length === 1) day = '0' + day
      return `${year}-${month}-${day}`
    }
    requireSignIn = () => {
      this.props.history.push('/signin')
    }
    render() {
      const { location: { search } } = this.props
      const { page, total } = this.state
      return <React.Fragment>
        <Paginator page={page} total={total} search={search} />
        {this.state.letters.map(letter => <Letter key={letter._id}
          {...letter} date={this.getDate(letter.datetime)}
          search={search} page={page} requireSignIn={this.requireSignIn} />)}
        <Paginator page={page} total={total} search={search} />
      </React.Fragment>
    }
  }
)