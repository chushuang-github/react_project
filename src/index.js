import React from 'react'
import ReactDOM from 'react-dom'
//Provider字面是供应商的意思，是凌驾于App之上的顶级组件
import {Provider} from 'react-redux'
//store官方希望从入口index.js文件中引入
import store from './redux/store'
import App from './App'

//redux中通过App传递store，但是使用react-redux之后就不使用App传递store
//将store放在顶级组件Provider里
//使用Provider监听组件，当状态发生变化的时候，重新渲染页面
//redux是通过store.subscribe，在状态发生变化的时候重新渲染页面，但是写法复杂
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'))
