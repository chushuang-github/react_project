import React,{Component} from 'react'
import {Icon,Button,Modal} from 'antd'
import {connect} from 'react-redux'
import screenfull from 'screenfull'
import dayjs from 'dayjs'
//在非路由组件中，要使用路由组件的api，header不是路由组件，用不了路由组件的api
//withRouter是一个高阶组件，接收一个组件，返回一个新组件
//header经过withRouter的包装就可以使用了
import {withRouter} from 'react-router-dom'
import menuList from '../../../config/menu_config'
import {reqWeather} from '../../../api'
import {createDeleteUserInfoAction} from '../../../redux/action_creators/login_action'
import './css/header.less'


const {confirm} = Modal
 
class Header extends Component{
  //全屏切换，点击的图标是需要变换的，所以放在状态里面
  //也可以定义一个变量，变量true图标是一个样，变量为false图标是另一个样
  //注意：用户在全屏状态是，点击Esc键也可以退出全屏
  state = {
    isFull: false,   //是否全屏，一上来不是全屏
    //dayjs()调用返回的是一个时间戳对象，format是格式化的意思，
    //Y是year的意思，M和D是month和day的意思，后面就是时分秒的意思
    data: dayjs().format('YYYY年 MM月DD日 HH:mm:ss'),
    weatherInfo:{},
    title: ''
  }
  
  componentDidMount(){
    //组件挂载到页面上，给screenfull绑定事件监听，当全屏和非全屏变化时，执行此监听
    //screenfull中的这些方法都是github中screenfull库api文档中写的，看文档要学会使用
    screenfull.on('change', () => {
      let isFull = !this.state.isFull
      this.setState({isFull})
    })
    //开启一个循环定时器，时间每隔1s，更新一次状态里面的时间
    this.timer = setInterval(() => {
      this.setState({data:dayjs().format('YYYY年 MM月DD日 HH:mm:ss')})
    }, 1000)
    this.getWeather()
    this.getTitle()
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }

  fullScreen = () => {
    // screenfull.request()   //全屏请求
    // screenfull.toggle(event.target)  //让当前目标全屏，里面可以传元素
    screenfull.toggle()   //点击一下全屏，在点击一下退出全屏，全屏切换
  }

  //获取天气
  getWeather = async() => {
    let result = await reqWeather('上海')
    this.setState({weatherInfo:result})
  }

  //退出登录logout
  //localStorage里面的数据要清除，redux里面的数据也要干掉
  logout = () => {
    const that = this
    //只有调用下面方法，redux中状态发生变化，就重新渲染admin组件
    //admin组件中render重新调用，会进行是否登录的判断，如果没有登录，回退到登录页面
    //点击按钮，会出现，是否退出的弹窗，点击确认，才会退出
    //confirm里面的对象是配置对象，配置对象里面的属性可以antd组件的api文档查看
    confirm({
      title: '确定退出登录吗?',
      content: '若退出登录，需要重新登录',
      okText: '确认',
      cancelText: '取消',
      onOk(){
        //onOk里面的this不是组件的实例对象，我们还可以将onOk变成箭头函数解决this指向问题
        that.props.deleteUserInfo()
      },
      onCancel(){},
    }); 
  }

  //看menu_config.js中菜单配置文件的格式，匹配到正确的key，找出key所对应title
  //我们这里使用了数组的两种方法：find方法和forEach方法，其中find方法是有返回值的
  getTitle = () => {
    let {pathname} = this.props.location
    let pathKey = pathname.split('/').reverse()[0]
    //如果地址栏中的地址包含product，title就是key为product的那个菜单的标题
    if(pathname.indexOf('product') !== -1){
      pathKey = 'product'
    }
    //因为数组的方法不是异步的，所以可以在这里定义一个变量接收forEact和find的结果
    let title = ''
    menuList.forEach((item) => {
      if(item.children instanceof Array){
        let tmp = item.children.find((childItem) => {
          return childItem.key === pathKey
        })
        if(tmp){
          title = tmp.title
        }
      }else{
        if(pathKey === item.key){
          title = item.title 
        }
      }
    })
    this.setState({title})
  }

  render(){
    let {isFull,weatherInfo} = this.state
    let {username} = this.props.userInfo.user
    return (
      <header className="header">
        <div className="header_top">
          <Button size="small" onClick={this.fullScreen}>
            <Icon type= {isFull ? "fullscreen-exit" : "fullscreen"}/>
          </Button>
          <span className="username">欢迎,{username}</span>
          <Button type="link" onClick={this.logout}>退出登录</Button>
        </div>

        <div className="header_bottom">
          <div className="header_bottom_left">
            {this.props.title || this.state.title}
          </div>
          <div className="header_bottom_right">
            {this.state.data}
            <img src={weatherInfo.dayPictureUrl} alt="晴"/> 
            {weatherInfo.weather}&nbsp;&nbsp;&nbsp;温度: {weatherInfo.temperature}
          </div>
        </div>
      </header>
    )
  }
} 
//有一个原则：connect永远外放，connect在最外层
export default connect(
  state => ({userInfo: state.userInfo, title: state.title}),
  {
    deleteUserInfo: createDeleteUserInfoAction
  }
)(withRouter(Header))