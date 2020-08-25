import React, { Component } from 'react'
import './css/navbar.css'
import { DatePicker } from './DatePicker'
import { MyEditor } from './MyEditor'

export class Navbar extends Component {
  static getDerivedStateFromProps(props, state) {
    const urlSearch = new URLSearchParams(props.location.search)
    const search = urlSearch.get('search') || ''
    const date = urlSearch.get('date') || ''
    if (state.search !== search || state.date !== date) {
      return {
        search,
        date
      }
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      dateFocused: false,
      search: '',
      show: false,
      date: ''
    }
    this.ddRef = React.createRef()
    this.searchRef = React.createRef()
  }
  formNewSearch(s, d) {
    let search = s !== null ? s : this.state.search
    let date = d !== null ? d : this.state.date
    let value = `?${search ? `search=${search}` : ''}${search && date ? '&' : ''}${date ? `date=${date}` : ''}`
    if (value.length < 5) return ''
    return value
  }
  onSearchChange = () => {
    clearTimeout(this.debouncer)
    this.debouncer = setTimeout(() => {
      if (this.searchRef.current.value !== this.state.search) {
        this.props.history.push(`/book/1${this.formNewSearch(this.searchRef.current.value, null)}`)
      }
    }, 700)
  }
  changeDateQuery = value => {
    this.setState({ dateFocused: false })
    if (value !== this.state.date) {
      let date = this.formNewSearch(null, value)
      this.setState({ date }, () => this.props.history.push(`/book/1${date}`))
    }
  }
  showDatePicker = () => {
    this.setState({ dateFocused: true }, () =>
      setTimeout(() => this.ddRef.current.focus(), 150))
  }
  hideDatePicker = () => {
    this.setState({ dateFocused: false })
  }
  checkAndShow = () => {
    if (this.state.show) return
    if (sessionStorage.getItem('love_token')) {
      this.setState({ show: true })
    } else {
      this.props.history.push('/signin')
    }
  }
  closeShow = () => {
    this.setState({ show: false })
  }
  render() {
    return <nav className="navbar navbar-expand bg-light navbar-light sticky-top">
      <div className="navbar-item">
        <form className="form-inline">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text"><i className="fa fa-search" /></span>
            </div>
            <input type="text" name="search" className="form-control" defaultValue={this.state.search}
              placeholder="Search" ref={this.searchRef} onChange={this.onSearchChange} />
          </div>
        </form>
      </div>
      <div className="navbar-item ml-auto">
        <button onClick={this.showDatePicker} className="btn btn-light">
          <i className="fa fa-calendar" />
        </button>
        <DatePicker
          dateFocused={this.state.dateFocused}
          hide={this.hideDatePicker}
          ddRef={this.ddRef}
          changeDateQuery={this.changeDateQuery}
          date={this.state.date}
        />
      </div>
      <div className="navbar-item">
        <button className='btn btn-light' draggable={false} onClick={this.checkAndShow}>
          <i className="fa fa-plus" />
        </button>
      </div>
      <MyEditor show={this.state.show} closeShow={this.closeShow} />
    </nav>
  }
}