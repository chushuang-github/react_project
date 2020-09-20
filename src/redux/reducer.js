//reducer要拿到以前的状态和action(干什么+数据)
//reducer作用：previousState ---> newState
//推荐用默认暴露
//reducer在初始化的时候调用一次，更新状态的时候也会调用
//reducer中的previousState后面写个=，=后面的东西是用来初始化状态使用的
import {ADD,REDUCE} from './action_types'
let initState = 0
export default function operationCount (previousState=initState, action){
  /* 规则
    1、在reducer中不可以修改传递过来的参数
  ***/ 
  console.log('reducer调用了',action)
  //根据action中的type和data，决定应该怎么操作状态
  let {type,data} = action
  //从action身上取出东西，根据取出的东西进行后续的操作
  //官方并不希望写if判断，官方希望首推的是switch语句
  let newState
  switch(type){
    case ADD:
      newState = previousState + data;
      console.log(newState)
      return newState;
    case REDUCE:
      newState = previousState - data;
      return newState;
    default:
      return previousState
  }
}