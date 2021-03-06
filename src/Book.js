import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearState } from './store/storeActions'
import { Letter } from './Letter'
import { Paginator } from './Paginator'
import escapeRegex from 'escape-string-regexp'

const domParser = new DOMParser()

function find(text, search, replace) {
  const doc = domParser.parseFromString(text, 'text/html')
  const testPat = RegExp(escapeRegex(search), 'i')
  const replacePat = replace ? RegExp(escapeRegex(search), 'gi') : null
  for (let node of doc.body.childNodes) {
    if (node.nodeName === 'UL' || node.nodeName === 'OL') {
      for (let li of node.childNodes) {
        if (testPat.test(li.textContent)) {
          if (replace) {
            li.innerHTML = li.textContent.replace(replacePat, '<span class="bg-warning">$&</span>')
          } else {
            return true
          }
        }
      }
    } else {
      if (testPat.test(node.textContent)) {
        if (replace) {
          node.innerHTML = node.textContent.replace(replacePat, '<span class="bg-warning">$&</span>')
        } else {
          return true
        }
      }
    }
  }
  if (replace) {
    return doc.body.innerHTML
  } else {
    return false
  }
}

function test(text, search) {
  return find(text, search, false)
}
function replace(text, search) {
  return find(text, search, true)
}

const LETTERS_PER_PAGE = 5

const mapStateToProps = ({ letters, dirty }) => ({ letters, dirty })
const mapDispatchToProps = {
  clearState
}

export const Book = connect(mapStateToProps, mapDispatchToProps)(
  class extends Component {
    static getDerivedStateFromProps(props, state) {
      const page = Number(props.match.params.page)
      if (Number.isNaN(page)) return null
      const urlSearch = new URLSearchParams(props.location.search)
      const search = urlSearch.get('search')
      let date = urlSearch.get('date')
      let letters = null
      if (date !== state.date || search !== state.search || props.dirty) {
        const ldate = date ? new Date(date) : null
        letters = props.letters.filter(l => {
          const letDate = new Date(l.datetime)
          if ((!ldate || letDate > ldate)
            && (!search || test(l.text, search))) {
            return true
          }
          return false
        })
        if (ldate) letters = letters.reverse()
      } else {
        letters = state.letters === null ? props.letters : state.letters
      }
      const total = Math.ceil(letters.length / LETTERS_PER_PAGE) || 1
      if (page > total || page < 1)
        return null
      const pageLetters = letters.slice((page - 1) * LETTERS_PER_PAGE, page * LETTERS_PER_PAGE)
      pageLetters.forEach(l => {
        if (search) {
          l.altText = replace(l.text, search)
        } else {
          delete l.altText
        }
      })
      return {
        page,
        total,
        letters,
        pageLetters,
        date,
        search
      }
    }
    onComponentDidUpdate() {
      if (this.props.dirty)
        this.props.clearState()
    }
    constructor(props) {
      super(props)
      this.state = {
        page: 0,
        total: 0,
        letters: null,
        pageLetters: null,
        date: null,
        search: null
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
        {this.state.pageLetters.map(letter => <Letter key={letter._id}
          {...letter} date={this.getDate(letter.datetime)}
          search={search} page={page} requireSignIn={this.requireSignIn} />)}
        <Paginator page={page} total={total} search={search} />
      </React.Fragment>
    }
  }
)