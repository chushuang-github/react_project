//从redux中引入createStore，用于创建最核心的store对象
//store是核心管理者，reducer是store手底下干活的人
import {createStore} from 'redux'  
//引入reducer
import reducer from './reducer'

//调用createStore，里面需要传一个参数reducer
let store = createStore(reducer)
export default store
