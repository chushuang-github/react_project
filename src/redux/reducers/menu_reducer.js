import {SAVE_TITLE} from '../action_types'

let initState = ''
export default function test (previousState=initState,action){
  let {type,data} = action
  let newState
  switch (type) {
    case SAVE_TITLE:
      newState = data
      return newState
    default:
      return previousState
  }
}