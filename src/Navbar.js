import React, { Component } from 'react'
import './css/navbar.css'
import { MyEditor } from './MyEditor'

export class Navbar extends Component {
  static getDerivedStateFromProps(props, state) {
    const urlSearch = new URLSearchParams(props.location.search)
    const search = urlSearch.get('search') || ''
    const date = urlSearch.get('date') || ''
    if (state.search !== search || state.date !== date) {
      return { search, date }
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      dateFocused: false,
      date: '',
      search: '',
      show: false
    }
    this.dPickerRef = React.createRef()
    this.searchRef = React.createRef()
  }
  formNewSearch(s, d) {
    let search = s !== null ? s : this.state.search
    let date = d !== null ? d : this.state.date
    let value = `?${search ? `search=${search}` : ''}${search && date ? '&' : ''}${date ? `date=${date}` : ''}`
    if (value.length < 5) return ''
    return value
  }
  showDatePicker = () => {
    this.setState({ dateFocused: true }, () =>
      setTimeout(() => this.dPickerRef.current.focus(), 150))
  }
  onBlurHandler = ev => {
    if (ev.relatedTarget && (ev.relatedTarget.id === 'clear' || ev.relatedTarget.id === 'ok')) {
      ev.preventDefault()
    } else this.setState({ dateFocused: false })
  }
  onSubmitHandler = ev => {
    ev.preventDefault()
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
      this.props.history.push(`/book/1${this.formNewSearch(null, value)}`)
    }
  }
  onClearClicked = () => {
    this.changeDateQuery('')
  }
  onOkClicked = () => {
    this.changeDateQuery(this.dPickerRef.current.value)
  }
  closeShow = () => {
    this.setState({ show: false })
  }
  checkAndShow = () => {
    if (this.state.show) return
    if (sessionStorage.getItem('love_token')) {
      this.setState({ show: true })
    } else {
      this.props.history.push('/signin')
    }
  }
  render() {
    return <nav className="navbar navbar-expand bg-light navbar-light sticky-top">
      <div className="navbar-item">
        <form className="form-inline">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text"><i className="fa fa-search" /></span>
            </div>
            <input type="text" name="search" className="form-control"
              placeholder="Search" ref={this.searchRef} onChange={this.onSearchChange} />
          </div>
        </form>
      </div>
      <div className="navbar-item ml-auto">
        <button onClick={this.showDatePicker} className="btn btn-light">
          <i className="fa fa-calendar" />
        </button>
        <form id="dpicker" onSubmit={this.onSubmitHandler}
          style={this.state.dateFocused ? {} : { display: "none" }}
          onBlur={this.onBlurHandler}>
          <div className="input-group">
            <input type="date" name="date" className="form-control"
              ref={this.dPickerRef} />
            <div className="input-group-append">
              <button id="clear" className="btn btn-secondary" type="button" onClick={this.onClearClicked}>
                <i className="fa fa-undo" />
              </button>
              <button id="ok" className="btn btn-primary" type="submit" onClick={this.onOkClicked}>
                <i className="fa fa-check" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="navbar-item">
        <button className='btn btn-light' draggable={false} onClick={this.checkAndShow}>
          <i className="fa fa-plus" />
        </button>
      </div>
      <MyEditor key="new" show={this.state.show} closeShow={this.closeShow} />
    </nav>
  }
  processQueryProps() {
    this.dPickerRef.current.value = this.state.date
    this.searchRef.current.value = this.state.search
    if (this.dPickerRef.current.value !== this.state.date) {
      this.props.history.replace(`/book/1${this.formNewSearch(null, this.dPickerRef.current.value)}`)
    }
  }
  componentDidMount() {
    this.processQueryProps()
  }
  componentDidUpdate() {
    this.processQueryProps()
  }
}