import React, { Component } from 'react';
import { Menu, Icon } from 'antd'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import logo from './.././../../static/imgs/logo.png'
import menuList from '../../../config/menu_config'
import './css/left_nav.less'
import {createSaveTitleAction} from '../../../redux/action_creators/menu_action'

const { SubMenu, Item } = Menu
class LeftfNav extends Component {
  // componentDidMount(){
  //   console.log(this.props.location.pathname.split('/').splice(2)) 
  // }

  //用于创建菜单的函数
  //map遍历数组，将一个数据的数组加工成一个标签数组
  //一点要注意：调用createMenu这个函数的返回值不是map方法中回调函数中的返回值
  createMenu = (targetArr) => {
    return (
      targetArr.map((item) => {
        //如果菜单的key拥有权限
        if(this.hasAuth(item)){
          //如果数组中的对象没有children属性，说明这个菜单一点就可以跳转
          if(!item.children){
            return (
              <Item key={item.key} onClick={() => {this.props.saveTitle(item.title)}}>
                <Link to={item.path}>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </Link>
              </Item>
            )
          }else{
            //如果数组的的对象有children属性，说明点击会展示或者隐藏它的孩子
            return (
              <SubMenu
                key={item.key}
                title={
                  <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                  </span>
                }
              >
                {this.createMenu(item.children)}
              </SubMenu>
            )
          }
        }
      })
    )
  }
  //判断菜单是否拥有权限
  hasAuth = (item) => {
    //获取当前用户可以看到的菜单的数组
    const {menus,username} = this.props
    // console.log(this.props.menus)   //['home','category','user','line']权限
    // console.log(item)   //菜单的每一项
    if(username === 'admin') return true
    //如果没有孩子，看菜单的key是否在menus数组里面
    else if(!item.children){
      return menus.find((item2)=>{return item2 === item.key})
     //如果有孩子，这里推出一个新的方法:数组的some方法
     //some方法返回的是一个boolean值
    }else if(item.children){
      return item.children.some((item3) => {return menus.indexOf(item3.key) !== -1})
      //下面两行也是对的
      // const cItem = item.children.find(item3 => menus.indexOf(item3.key) != -1)
      // return !!cItem
    }
  }

  render() {
    let {pathname} = this.props.location
    return (
      <div>
        <header className="nav-header">
          <img src={logo} alt=""/>
          <h1>商品管理系统</h1>
        </header>
        <Menu
          //如果地址栏中的路径中有product，就选中product，没有product，及选中最后一位
          selectedKeys={pathname.indexOf('product')!==-1 ? 'product':pathname.split('/').reverse()[0]}
          defaultOpenKeys={this.props.location.pathname.split('/').splice(2)}
          mode="inline"
          theme="dark"
        >
          {
            this.createMenu(menuList)
          }
        </Menu>
      </div>
    );
  }
}

export default connect(
  state => ({
    menus:state.userInfo.user.role.menus,
    username:state.userInfo.user.username
  }),
  {
    saveTitle: createSaveTitleAction
  }
)(withRouter(LeftfNav))