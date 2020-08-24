import React, { useState } from 'react'
import { MyEditor } from './MyEditor'
import './css/letter.css'

export function Letter(props) {
  const [show, setShow] = useState(false)
  const checkAndShow = () => {
    if (show) return
    if (sessionStorage.getItem('love_token')) {
      setShow(true)
    } else props.requireSignIn()
  }

  return <div className='letter p-3' id={props._id}>
    <div className='letter-content p-3 text-dark bg-light'>
      <div className="mb-2">
        <div className='text-primary h4' style={{ userSelect: 'none', textDecoration: 'underline' }}>{props.name}</div>
        <div className='ml-auto'>
          <span className='date ml-3' style={{ userSelect: 'none' }}>{props.date}</span>
          <button className='btn btn-light btn-sm ml-2' onClick={checkAndShow}>
            <i className="fa fa-cog" />
          </button>
        </div>
      </div>
      <div className='text' dangerouslySetInnerHTML={{ __html: props.altText || props.text }}></div>
    </div>
    <MyEditor
      show={show}
      closeShow={() => setShow(false)}
      _id={props._id}
      datetime={props.datetime}
      name={props.name}
      text={props.text}
    />
  </div>
}