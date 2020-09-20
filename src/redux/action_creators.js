//创建一个add和reduce的action
import {ADD,REDUCE} from './action_types'
export const createAddAction = value=>({type:ADD, data: value})
export const createReduceAction = value=>({type:REDUCE, data: value})
