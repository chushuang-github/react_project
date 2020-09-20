import React,{Component} from 'react'

export default class Counter extends Component {
  //不管是谁管理状态，生命周期勾子肯定都是好用的
  //ui组件需要的参数都从包裹它的容器组件里面取
  componentDidMount(){
    console.log(this.props.add)
    console.log(this.props.reduce)
  }
  //加法
  add = () => {
    let {value} = this.refs.selectNubmer
    this.props.add(value*1)
  }
  //减法
  reduce = () => {
    let {value} = this.refs.selectNubmer
    this.props.reduce(value*1)
  }
  //如果是count是奇数就相加
  incrementIfOdd = () => {
    let {value} = this.refs.selectNubmer
    let {count} = this.props
    if(count%2 === 1){
      this.props.add(value*1)
    }
  }
  //一秒后相加
  incrementAsync = () => {
    let {value} = this.refs.selectNubmer
    setTimeout(() => {
      this.props.add(value*1)
    }, 1000)
  }

  render(){
    //拿到的状态
    //let count = this.props.store.getState()
    return (
      <div>
        <h3>当前计数为{this.props.count}</h3>
        <select ref="selectNubmer">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>&nbsp;
        <button onClick={this.add}> + </button> &nbsp;
        <button onClick={this.reduce}> - </button> &nbsp;
        <button onClick={this.incrementIfOdd}> increment if odd </button> &nbsp;
        <button onClick={this.incrementAsync}> incrememt async </button>
      </div>
    )
  }
}