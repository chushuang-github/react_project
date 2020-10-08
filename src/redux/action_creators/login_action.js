import {SAVE_USERINFO,DELETE_USERINFO} from '../action_types'
export const createSaveUserInfoAction = (value) => {
  //reture之前，往localStorage里面存入数据
  localStorage.setItem('user', JSON.stringify(value))
  return {type:SAVE_USERINFO, data:value}
}
export const createDeleteUserInfoAction = () => {
  //点击退出登录，清除localStorage中的数据
  localStorage.clear() 
  return {type:DELETE_USERINFO}
}


