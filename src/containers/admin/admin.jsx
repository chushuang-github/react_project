import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom'
import {Layout} from 'antd'
import Header from './header/header'
import LeftNav from './nav_left/left_nav'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import AddUpdate from '../product/add_update'
import Detail from '../product/detail'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie' 
import './css/admin.less'

const { Footer, Sider, Content } = Layout


class Admin extends Component{

  //在render里面，若想实现跳转，最好用<Redirect/>
  //render里面必须要有return
  render() {
    const {isLogin} = this.props.userInfo
    //如果没有登录，isLogin是false，!isLogin就是true
    if(!isLogin){
      console.log('没有登录')
      return <Redirect to="/login"/>
    }else{
      //如果登录了就进入此逻辑
      return (
        <Layout className="admin">
          <Sider className="sider">
            <LeftNav/>
          </Sider> 
          <Layout>
            <Header />
            <Content className="content">
              <Switch>
                <Route path="/admin/home" component={Home}/>
                <Route path="/admin/prod_about/category" component={Category}/>
                <Route path="/admin/prod_about/product" component={Product} exact/>
                <Route path="/admin/prod_about/product/detail/:id" component={Detail}/>
                <Route path="/admin/prod_about/product/add_update" component={AddUpdate} exact/>
                <Route path="/admin/prod_about/product/add_update/:id" component={AddUpdate}/>
                <Route path="/admin/user" component={User}/>
                <Route path="/admin/role" component={Role}/>
                <Route path="/admin/charts/bar" component={Bar}/>
                <Route path="/admin/charts/line" component={Line}/>
                <Route path="/admin/charts/pie" component={Pie}/>
                <Redirect to="/admin/home"/>
              </Switch>
            </Content>
            <Footer className="footer">推荐使用谷歌浏览器，获取最佳用户体验</Footer>
          </Layout>
        </Layout>
      )
    }
  }
}
export default connect(
  state => ({userInfo: state.userInfo}),
  {
    
  } 
)(Admin)