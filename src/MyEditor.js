import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createLetter, updateLetter, deleteLetter } from './store/storeActions'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '+1' }],
    [{ 'align': '' }, { align: 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
    ['link'],
    ['clean']
  ],
}

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'align',
]

const mapDispatchToProps = { createLetter, updateLetter, deleteLetter }

export const MyEditor = connect(null, mapDispatchToProps)(
  function (props) {
    const [name, setName] = useState(props.name || 'Setareh')
    const [datetime, setDatetime] = useState(getLocalTimeFormat(props.datetime || new Date().toISOString()))
    const [text, setText] = useState(props.text || '')

    function getLocalTimeFormat(datetime) {
      function ten(n) {
        return (n < 10 ? '0' : '') + n
      }
      let date = new Date(datetime)
      return `${date.getFullYear()}-${ten(date.getMonth() + 1)}-${ten(date.getDate())}T${ten(date.getHours())}:${ten(date.getMinutes())}`
    }

    const nameChanged = ({ target: { value } }) => {
      if (value !== 'Setareh' && value !== 'Arthur') return
      setName(value)
    }
    const datetimeChanged = ({ target: { value } }) => {
      setDatetime(value)
    }
    const deleteLetter = () => {
      if (window.confirm("Are you sure you want to delete this letter?")) {
        props.deleteLetter(props._id)
        props.closeShow()
      }
    }
    const saveLetter = () => {
      let date = new Date(datetime)
      if (date > new Date()) {
        date = new Date()
      }
      const letter = {
        name, datetime: date.toISOString(), text: text
      }
      const parser = new DOMParser()
      const doc = parser.parseFromString(letter.text, "text/html")
      if (doc.body.textContent.length === 0) return
      if (props._id) {
        letter._id = props._id
        props.updateLetter(letter)
      } else {
        props.createLetter(letter)
      }
      hide()
    }
    const hide = () => {
      setName(props.name || 'Setareh')
      setDatetime(getLocalTimeFormat(props.datetime || new Date().toISOString()))
      setText(props.text || '')
      props.closeShow()
    }

    return (
      <Modal size="lg" show={props.show} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>{props._id ? "Edit Letter" : "New Letter"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mt-3">
            <select className="form-control" name="name"
              onChange={nameChanged}
              value={name}>
              <option>Setareh</option>
              <option>Arthur</option>
            </select>
          </div>
          {
            !props.datetime &&
            <div className="form-group">
              <input type="datetime-local" className="form-control" value={datetime}
                name="datetime" onChange={datetimeChanged} />
            </div>
          }
          <div className="form-group">
            <ReactQuill
              value={text}
              onChange={(val) => setText(val)}
              modules={modules}
              formats={formats}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="form-group">
            {
              props._id &&
              <button className="btn btn-danger mr-1" style={{ width: 100 }} onClick={deleteLetter}>Delete</button>
            }
            <button className="btn btn-dark mr-1" style={{ width: 100 }} onClick={hide}>Cancel</button>
            <button className="btn btn-info" style={{ width: 100 }} onClick={saveLetter}>Save</button>
          </div>
        </Modal.Footer>
      </Modal>
    )
  }
)