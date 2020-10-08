import {SAVE_PROD_LIST} from '../action_types'

let initState = []
export default function test (previousState=initState,action){
  let {type,data} = action
  let newState
  switch (type) {
    case SAVE_PROD_LIST:
      newState = [...data]
      return newState
    default:
      return previousState
  }
}