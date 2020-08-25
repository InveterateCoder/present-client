import React, { useRef, useState, useEffect } from 'react'

export function DatePicker(props) {
  const [yyyy, setYYYY] = useState('')
  const [mm, setMM] = useState('')
  const [dd, setDD] = useState('')

  const yyyyRef = useRef()
  const mmRef = useRef()
  const ddRef = props.ddRef

  useEffect(() => {
    const dates = props.date.split('-')
    if ((dates[0] || '') !== yyyy)
      setYYYY(dates[0] || '')
    if ((dates[1] || '') !== mm)
      setMM(dates[1] || '')
    if ((dates[2] || '') !== dd)
      setDD(dates[2] || '')
  }, [props.date])

  useEffect(() => {
    switch (document.activeElement) {
      case yyyyRef.current:
        if (yyyy.length === 4) {
          mmRef.current.focus()
        }
        break;
      case mmRef.current:
        if (mm > 1) {
          ddRef.current.focus()
        }
        break;
    }
  }, [yyyy, mm])

  const onDateInputChange = ({ target: { name, value } }) => {
    if (isNaN(value)) return
    const now = new Date()
    const nyyyy = now.getFullYear().toString()
    const nmm = now.getMonth() + 1
    const ndd = now.getDate()
    function setDate(month = false) {
      if (!month) {
        setYYYY(value)
        setMM('')
      } else {
        setMM(value)
      }
      setDD('')
    }
    switch (name) {
      case 'yyyy':
        switch (value.length) {
          case 0:
            return setDate()
          case 1:
            if (value < 2 || value > nyyyy[0]) return
            return setDate()
          case 2:
            if (value > nyyyy.slice(0, 2)) return
            return setDate()
          case 3:
            if (value < 202 || value > nyyyy.slice(0, 3)) return
            return setDate()
          default:
            if (value > nyyyy) return
            return setDate()
        }
      case 'mm':
        if (value.length === 0) return setDate(true)
        if (value < 1 || value > 12) return
        if (nyyyy === yyyy && value > nmm) return
        return setDate(true)
      case 'dd':
        if (value.length === 0) return setDD(value)
        if (value < 1 || value > 31) return
        if (yyyy === nyyyy && mm == nmm && value > ndd) return
        const testDate = new Date(`${yyyy}-${mm}-${value}`)
        if (testDate.getDate() != value) return
        return setDD(value)
    }
  }
  const onDateInputKeyDown = ({ which, target: { name } }) => {
    if (which === 8) {
      if (name === 'mm') {
        if (mm.length === 0) {
          yyyyRef.current.focus()
        }
      } else {
        if (dd.length === 0) {
          mmRef.current.focus()
        }
      }
    }
  }
  const onDateInputFocus = ({ target: { name } }) => {
    if (name === 'yyyy') {
      if (dd) {
        ddRef.current.focus()
      } else if (mm) {
        mmRef.current.focus()
      }
    } else if (name === 'mm') {
      if (!yyyy || yyyy.length < 4)
        yyyyRef.current.focus()
      else if (dd) {
        ddRef.current.focus()
      }
    } else {
      if (!mm)
        mmRef.current.focus()
    }
  }
  const formDateString = () => {
    let str = ''
    if (yyyy && yyyy.length === 4) {
      str += yyyy
      if (mm) {
        str += '-' + mm
        if (dd) {
          str += '-' + dd
        }
      }
    }
    return str
  }
  const onBlurHandler = ev => {
    if (ev.relatedTarget
      && (ev.relatedTarget.id === 'clear'
        || ev.relatedTarget.id === 'ok'
        || ev.relatedTarget.name === 'yyyy'
        || ev.relatedTarget.name === 'mm'
        || ev.relatedTarget.name === 'dd')) {
      ev.preventDefault()
    } else props.hide()
  }
  const onSaveClicked = () => {
    props.changeDateQuery(formDateString())
  }
  const onClearClicked = () => {
    props.changeDateQuery('')
  }
  return <form id="dpicker" onSubmit={ev => ev.preventDefault()}
    style={props.dateFocused ? {} : { display: "none" }}
    onBlur={onBlurHandler}>
    <div className="input-group">
      <div id="date-search" className="form-control">
        <input type="text"
          ref={yyyyRef}
          name="yyyy"
          placeholder="yyyy"
          size="4"
          onFocus={onDateInputFocus}
          onChange={onDateInputChange}
          value={yyyy}
        />
        <input
          ref={mmRef}
          type="text"
          name="mm"
          placeholder="mm"
          size="2"
          onFocus={onDateInputFocus}
          onChange={onDateInputChange}
          onKeyDown={onDateInputKeyDown}
          value={mm}
        />
        <input
          ref={props.ddRef}
          type="text"
          name="dd"
          placeholder="dd"
          size="2"
          onFocus={onDateInputFocus}
          onChange={onDateInputChange}
          onKeyDown={onDateInputKeyDown}
          value={dd}
        />
      </div>
      <div className="input-group-append">
        <button id="clear" className="btn btn-secondary" type="button" onClick={onClearClicked}>
          <i className="fa fa-undo" />
        </button>
        <button id="ok" className="btn btn-primary" onClick={onSaveClicked}>
          <i className="fa fa-check" />
        </button>
      </div>
    </div>
  </form>
}