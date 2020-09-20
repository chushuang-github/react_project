import React,{Component} from 'react'
//不能直接跟ui组件对话，必须和ui组件外面包裹的容器组件对话
import CounterContainer from './containers/counter_container'

export default class App extends Component {
  render(){
    return (
      <CounterContainer/>
    )
  }
}