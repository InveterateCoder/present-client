import React, { Component } from 'react'
import './css/navbar.css'
import { MyEditor } from './MyEditor'

export class Navbar extends Component {
  static getDerivedStateFromProps(props, state) {
    const urlSearch = new URLSearchParams(props.location.search)
    const search = urlSearch.get('search') || ''
    const date = urlSearch.get('date') || ''
    if (state.search !== search || state.date !== date) {
      if (state.date !== date) {
        const [yyyy, mm, dd] = date.split('-')
        return {
          search,
          date,
          yyyy: yyyy || '',
          mm: mm || '',
          dd: dd || ''
        }
      }
      return { search }
    }
    return null
  }
  constructor(props) {
    super(props)
    this.state = {
      dateFocused: false,
      search: '',
      show: false,
      date: '',
      yyyy: '',
      mm: '',
      dd: '',
    }
    this.yyyyRef = React.createRef()
    this.mmRef = React.createRef()
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
  showDatePicker = () => {
    this.setState({ dateFocused: true }, () =>
      setTimeout(() => this.ddRef.current.focus(), 150))
  }
  onBlurHandler = ev => {
    if (ev.relatedTarget
      && (ev.relatedTarget.id === 'clear'
        || ev.relatedTarget.id === 'ok'
        || ev.relatedTarget.name === 'yyyy'
        || ev.relatedTarget.name === 'mm'
        || ev.relatedTarget.name === 'dd')) {
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
      let date = this.formNewSearch(null, value)
      this.setState({ date }, () => this.props.history.push(`/book/1${date}`))
    }
  }
  onClearClicked = () => {
    this.changeDateQuery('')
  }
  formDateString() {
    let str = ''
    if (this.state.yyyy && this.state.yyyy.length === 4) {
      str += this.state.yyyy
      if (this.state.mm) {
        str += '-' + this.state.mm
        if (this.state.dd) {
          str += '-' + this.state.dd
        }
      }
    }
    return str
  }
  onOkClicked = () => {
    this.changeDateQuery(this.formDateString())
  }
  onDateInputChange = ({ target: { name, value } }) => {
    if (isNaN(value)) return
    const now = new Date()
    const yyyy = now.getFullYear().toString()
    const mm = now.getMonth() + 1
    const dd = now.getDate()
    switch (name) {
      case 'yyyy':
        switch (value.length) {
          case 0:
            return this.setState({ yyyy: value, mm: '', dd: '' })
          case 1:
            if (value < 2 || value > yyyy[0]) return
            return this.setState({ yyyy: value, mm: '', dd: '' })
          case 2:
            if (value > yyyy.slice(0, 2)) return
            return this.setState({ yyyy: value, mm: '', dd: '' })
          case 3:
            if (value < 202 || value > yyyy.slice(0, 3)) return
            return this.setState({ yyyy: value, mm: '', dd: '' })
          default:
            if (value > yyyy) return
            return this.setState({ yyyy: value }, () => {
              if (value.length === yyyy.length)
                this.mmRef.current.focus()
            })
        }
      case 'mm':
        if (value.length === 0) return this.setState({ mm: value, dd: '' })
        if (value < 1 || value > 12) return
        if (yyyy === this.state.yyyy && value > mm) return
        return this.setState({ mm: value, dd: '' }, () => {
          if (value > 1) this.ddRef.current.focus()
        })
      case 'dd':
        if (value.length === 0) return this.setState({ dd: value })
        if (value < 1 || value > 31) return
        if (this.state.yyyy === yyyy && this.state.mm == mm && value > dd) return
        const testDate = new Date(`${this.state.yyyy}-${this.state.mm}-${value}`)
        if (testDate.getDate() != value) return
        return this.setState({ dd: value })
    }
  }
  onDateInputFocus = ({ target: { name } }) => {
    if (name === 'mm') {
      if (!this.state.yyyy || this.state.yyyy.length < 4)
        this.yyyyRef.current.focus()
    } else {
      if (!this.state.mm)
        this.mmRef.current.focus()
    }
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
            <input type="text" name="search" className="form-control" defaultValue={this.state.search}
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
            <div id="date-search" className="form-control">
              <input type="text"
                ref={this.yyyyRef}
                name="yyyy"
                placeholder="yyyy"
                size="4"
                onChange={this.onDateInputChange}
                value={this.state.yyyy}
              />
              <input
                ref={this.mmRef}
                type="text"
                name="mm"
                placeholder="mm"
                size="2"
                onFocus={this.onDateInputFocus}
                onChange={this.onDateInputChange}
                value={this.state.mm}
              />
              <input
                ref={this.ddRef}
                type="text"
                name="dd"
                placeholder="dd"
                size="2"
                onFocus={this.onDateInputFocus}
                onChange={this.onDateInputChange}
                value={this.state.dd}
              />
            </div>
            <div className="input-group-append">
              <button id="clear" className="btn btn-secondary" type="button" onClick={this.onClearClicked}>
                <i className="fa fa-undo" />
              </button>
              <button id="ok" className="btn btn-primary" onClick={this.onOkClicked}>
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
      <MyEditor show={this.state.show} closeShow={this.closeShow} />
    </nav>
  }
}