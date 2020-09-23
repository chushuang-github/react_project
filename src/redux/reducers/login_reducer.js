import {SAVE_USERINFO} from '../action_types'

let initState = {
  user: {},
  isLogin: false
}
export default function test (previousState=initState,action){
  let {type,data} = action
  let newState
  switch (type) {
    case SAVE_USERINFO:
      newState = {user:data, isLogin:true}
      return newState
    default:
      return previousState
  }
}