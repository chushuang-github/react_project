import React, {Component} from 'react';
import {Route,Switch} from 'react-router-dom'
import Admin from './pages/admin/admin.jsx'
//引入的不是我们定义的那个组件，而是根据我们定义的Login生成的新组件
import Login from './pages/login/login.jsx'

import './App.less'

export default class App extends Component{
  render(){
    return(
      <div className="app">
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/admin" component={Admin}/>
        </Switch>
      </div>
    )
  }
}

