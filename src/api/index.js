//配置项目里面所有的请求
import myAxios from './myAxios'
import {BASE_URL} from '../config'

//发起登录请求
export const reqLogin = (username, password) => {
  //中转人也是在3000端口的，我们只需要给中转人发请求就可以了
  //中转人就是代理服务器，代理服务器帮你转发请求
  /*
  封装axios
    1. 统一处理请求异常
    2. 异步请求成功的数据不是result, 而是result.data
  */
 //axios返回的是一个promise实例
  return myAxios.post(`${BASE_URL}/login`,{username,password})
  }

