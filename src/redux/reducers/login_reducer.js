import {SAVE_USERINFO,DELETE_USERINFO} from '../action_types'
 
let user = JSON.parse(localStorage.getItem('user'))
//如果user不为空，isLogin为true
let isLogin = user ? true : false
let initState = {
  //从locadStorage中取出来的user，有值就是取出来的user，user没值就为''
  user: user || '',
  isLogin
}
export default function test (previousState=initState,action){
  let {type,data} = action
  let newState
  switch (type) {
    case SAVE_USERINFO:
      newState = {user:data, isLogin:true}
      return newState
    case DELETE_USERINFO:
      newState = {user:'', isLogin:false}
      return newState
    default:
      return previousState
  }
}