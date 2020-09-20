//这是容器组件，是包裹ui组件的
//容器组件相当于一个中间人，是用来连接store和ui组件的
import Counter from '../components/counter.jsx'
import {connect} from 'react-redux'
import {createAddAction,createReduceAction} from '../redux/action_creators'

//容器组件想给ui组件state以及操作state的方法
//这个方法就是专门把从store中取出来的state映射成props，进而传递给ui组件
//下面两个函数的返回值必须是一个对象，因为子ui组件中的props是一个对象
//下面两个函数是完整写法，还有简写方式
//   function mapStateToProps (state){
//     return {count:state}
//   }
//   function mapDispatchToProps (dispatch){
//     return {
//       add: (value) => { dispatch(createAddAction(value)) },
//       reduce: (value) => { dispatch(createReduceAction(value)) }
//     }
//   }

// 简写方式
// let mapStateToProps = state => ({count:state})
// let mapDispatchToProps = dispatch => ({
//   add: (value) => { dispatch(createAddAction(value)) },
//   reduce: (value) => { dispatch(createReduceAction(value)) }
// })

//connect是一个函数调用，返回的还是一个函数，返回的函数中传的参数是ui组件
//connect是一个高级函数，作用是用来建立ui和store的连接
//调用connect函数返回的函数，这个函数传递一个组件参数后返回的是一个容器组件
//connect里面的两个函数，定义这两个函数的时候，返回值都是对象
//将对象中的key-value取出来，会传给它包裹的ui组件(Counter)，ui组件中通过props属性接收
//connect里面的两个函数参数顺序不能换
//第一个回调函数调用的时候传state，第二个回调函数调用的时候传dispatch
// export default connect(mapStateToProps,mapDispatchToProps)(Counter)

//按照新的写法
//如果connect函数的第二个参数传递的是一个对象
//这个对象中的key就是控制它包裹的UI组件Counter中三大属性中props中的key
//这个对象中的value就是：见截图,我们会在Counter组件中的props中输出一下add和reduce
export default connect(
  state => ({count:state}),
  {
    add: createAddAction,
    reduce: createReduceAction
  }
  )(Counter)

  //connect底层会在action外侧包了一层dispatch，没有value，自己构建了一个value
  //connect接收到一个函数，会在接收到的函数外侧包裹一个dispatch
  // function connect (createAddAction){
  //   return (value) => { dispatch(createAddAction(value)) }
  // }
  