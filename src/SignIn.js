import React, { useRef } from 'react'
import urls from './urls'

export function SignIn(props) {
  const passwordRef = useRef()
  const signIn = ({ isTrusted }) => {
    if (!isTrusted || passwordRef.current.value.length < 6) return
    fetch(urls.signin, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password: passwordRef.current.value })
    }).then(res => {
      if (res.status === 200) {
        res.json().then(token => {
          sessionStorage.setItem('love_token', token)
          props.history.goBack()
        })
      } else if (res.status === 400) {
        alert('Wrong password. Access denied.')
      } else alert('Something went terribly wrong. Please, try again later.')
    }).catch(err => alert(err.message))
  }
  const onKeyPress = ({ isTrusted, which }) => {
    if (which === 13)
      signIn({ isTrusted })
  }
  return <>
    <div id="signin" className="display-2 text-center text-light" style={{ textShadow: "0 0 7px black", userSelect: 'none' }}>Sign In</div>
    <div className="form-group">
      <label htmlFor="password"
        className="text-light"
        style={{ fontSize: '27px', textShadow: '0 0 3px black', userSelect: 'none' }}
      >
        Password
      </label>
      <div className="input-group">
        <input
          ref={passwordRef}
          id="password"
          type="password"
          className="form-control"
          placeholder="Enter Password"
          onKeyPress={onKeyPress}
        />
        <div className="input-group-append">
          <button className="btn btn-success" onClick={signIn}>
            <i className="fa fa-heartbeat mr-2" />
            Sign In
          </button>
        </div>
      </div>
    </div>
    <div className="text-right">
      <button
        className="btn btn-outline-light mr-4"
        style={{ borderRadius: "75px" }}
        onClick={() => props.history.goBack()}
      >
        <i className="fa fa-arrow-left" />
      </button>
    </div>
  </>
}