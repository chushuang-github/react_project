import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom'

class Admin extends Component{
  componentDidMount(){
    console.log('我是Admin组件',this.props)
  }
  //在render里面，若想实现跳转，最后用<Redirect/>
  //render里面必须要有return
  render() {
    const {user,isLogin} = this.props.userInfo
    //如果没有登录，isLogin是false，!isLogin就是true
    if(!isLogin){
      console.log('没有登录')
      return <Redirect to="/login"/>
    }else{
      //如果登录了就进入此逻辑
      return (
        <div>我是Admin组件，我的名字是{user.username}</div>
      )
    }
  }
}
export default connect(
  state => ({userInfo: state.userInfo}),
  {}
)(Admin)