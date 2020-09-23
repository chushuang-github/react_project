import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
//qs身上有一个stringify方法，将对象转化为urlencoded的编码的形式
//JSON身上的stringify方法，将对象转化为json的编码形式
import qs from 'querystring'
import {message} from 'antd'

const instance = axios.create({
  timeout:4000
})
//请求拦截器  --> 将post请求体参数统一转化为urlencoded编码形式
instance.interceptors.request.use(
  (config) => {
    NProgress.start()
    console.log(config)
    console.log(config.data)   //会发现data是一个对象
    const {method,data} = config
    //如果是post请求
    if(method.toLowerCase() === 'post'){
      //若传递过来的参数是对象(底层会偷偷的JSON.stringify)
      //我们将对象转化为urlended的编码形式，避免底层偷偷的转化为json形式
      if(data instanceof Object){
        config.data = qs.stringify(data)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//响应拦截器
instance.interceptors.response.use(
  //请求成功，但密码或用户名输入错误也会走此函数
  (response) => {
    NProgress.done()
    return response.data
  },
  //请求失败才会走此函数
  (error) => {
    NProgress.done()
    //出错会中的promise，但用户不知道，所以在这里提醒一下
    //message里面传第二个参数，意思是让弹窗存在多少秒
    message.error(error.message, 1)
    //如果请求失败，中断promise链，防止await报错
    return new Promise(()=>{})
  }
)
export default instance