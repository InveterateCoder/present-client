import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Book } from './Book'
import { SignIn } from './SignIn'

export function Selector(props) {
  return <>
    <Route path="/:route/:page/:id?" component={Navbar} />
    <Switch>
      <Route path="/book/:page" exact={true} strict={true} component={Book} />
      <Route path="/signin" exact={true} strict={true} component={SignIn} />
      <Redirect to="/book/1" />
    </Switch>
  </>
}