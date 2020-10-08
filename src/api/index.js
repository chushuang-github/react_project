//配置项目里面所有的请求
import myAxios from './myAxios'
import {BASE_URL} from '../config'
import { message } from 'antd'
import jsonp from 'jsonp'

//登录请求
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

//获取天气信息(百度接口)，用jsonp发送的请求，不会走拦截器
export const reqWeather = (city) => {
  // 执行器函数: 内部去执行异步任务, 
  // 成功了调用resolve(), 失败了不调用reject(), 直接提示错误
  return new Promise((resolve, reject) => { 
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, (error, data) => {
      if (!error && data.error===0) { // 成功的
        const {dayPictureUrl, weather, temperature} = data.results[0].weather_data[0]
        resolve({dayPictureUrl, weather, temperature})
      } else { // 失败的
        message.error('获取天气信息失败')
        return new Promise(()=>{})
      }
    }) 
  })
} 

//获取商品列表请求
export const reqCategoryList = () => {
  return myAxios.get(`${BASE_URL}/manage/category/list`)
}

//新增商品的分类
export const reqAddCategory = (categoryName) => {
  return myAxios.post(`${BASE_URL}/manage/category/add`,{categoryName})
}

//更新商品分类
export const reqUpdateCategory = (categoryId,categoryName) => {
  return myAxios.post(`${BASE_URL}/manage/category/update`,{categoryId,categoryName})
} 

//请求商品分页列表，第一个参数是第几页，第二个参数是每一页多少条数据
//注意axios中get请求时如何携带参数的
export const reqProductCategory = (pageNum, pageSize) => {
  return myAxios.get(`${BASE_URL}/manage/product/list`,{params:{pageNum, pageSize}})
} 

//更新商品状态，对商品进行上架实时下架处理，status=1是下架，status=2是上架
//第一个参数是数据库中搜索产品id，第二个参数是产品状态更新成什么样
export const reqUpdateProdStatus = (productId,status) => {
  return myAxios.post(`${BASE_URL}/manage/product/updateStatus`,{productId,status})
}

//搜索商品列表(搜索返回的数据也是分页的)
export const reqSearchProduct = (pageNum, pageSize,searchType,keyWord ) => {
  return myAxios.get(`${BASE_URL}/manage/product/search`,
    {params: {pageNum, pageSize,[searchType]:keyWord}})
}

//根据商品id，获取商品信息
export const reqProductById = (productId) => {
  return myAxios.get(`${BASE_URL}/manage/product/info`,{params:{productId}})
} 

//根据图片唯一名删除服务器中图片
export const reqDeletePicture = (name) => {
  return myAxios.post(`${BASE_URL}/manage/img/delete`,{name})
}

//添加商品
export const reqAddProduct = (productObj) => {
  return myAxios.post(`${BASE_URL}/manage/product/add`,productObj)
}

//更新商品信息
export const reqUpdateProduct = (productObj) => {
  return myAxios.post(`${BASE_URL}/manage/product/update`,productObj)
}

//请求角色列表(不是分页，一次性获取所有的角色)
export const reqRloeList = () => {
  return myAxios.get(`${BASE_URL}/manage/role/list`)
}

//请求添加角色
export const reqAddRole = (roleName) => {
  return myAxios.post(`${BASE_URL}/manage/role/add`,{roleName})
}

//请求给角色授权
export const reqAuthRloe = (roleObj) => {
  return myAxios.post(`${BASE_URL}/manage/role/update`,{...roleObj,auth_time:Date.now()})
}

//请求所有用户列表(同时会携带者角色列表回来)
export const reqUserListAndRole = () => {
  return myAxios.get(`${BASE_URL}/manage/user/list`)
}

//添加用户
export const reqAddUser = (userObj) => {
  return myAxios.post(`${BASE_URL}/manage/user/add`,userObj)
}

//删除用户
export const reqDeleteUser = (userId) => {
  return myAxios.post(`${BASE_URL}/manage/user/delete`,{userId})
}

//更新用户
export const reqUpdateUser = (userObj) => {
  return myAxios.post(`${BASE_URL}/manage/user/update`,userObj)
}
