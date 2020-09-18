import React, {Component} from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from './imgs/logo.png'
import './css/login.less'
const {Item} = Form
/*
用户名/密码的的合法性要求
  1). 必须输入
  2). 必须大于等于4位
  3). 必须小于等于12位
  4). 必须是英文、数字或下划线组成
 */
//用户名使用声明式验证，密码使用自定义验证

class Login extends Component{
  //点击登录按钮的回调
  handleSubmit = (event) => {
    //阻止默认事件 -->禁止form提交，通过ajax发送
    event.preventDefault();
    //validateFields：验证所有的装饰器(可以验证getFieldDecorator这个定义的所有规则)
    //values：把所有的form表单的数据整理到values对象上
    //values这个对象上的所有属性名都是使用getFieldDecorator时的被装饰者的标识名称
    this.props.form.validateFields((err, values) => {
      if(!err){
        console.log(values)
      }else{
        console.log(err)
      }
    });
  }
  //对密码进行自定义验证
  //value为自己输入的值,callback必须调用
  //为什么必须调用：因为不调用，在某些情况下，验证是错乱的
  passwordValidator = (rule, value, callback) => {
    if(!value){
      callback('密码不能为空')
    }else if(value.length > 12){
      callback('密码必须小于等于12位')
    }else if(value.length < 4){
      callback('密码必须大于等于4位')
    }else if(!(/^\w+$/).test(value)){
      callback('密码必须是字母、数字或下划线组成')
    }else{
      callback()
    }
  }

  render() {
  /*
    getFieldDecorator:装饰器，做实时校验(字面意思：获取域的装饰器)
    getFieldDecorator 是一个高阶函数(返回值是一个函数)
    getFieldDecorator(被装饰者的标识名称，配置对象)(组件标签) 返回新的标签
    经过 getFieldDecorator 包装的表单控件会自动添加 value和onChange，数据同步将被 form 接管
  ***/
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header>
          <img src={logo} alt="logo"/>
          <h1>商品管理系统</h1>
        </header>
        <section>
          <h1>用户登录</h1>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Item>
              {getFieldDecorator('username', {
                rules: [
                  {required: true, message: '用户名不能为空' },   
                  {max: 12, message: '用户名必须小于等于12位'},
                  {min: 4, message: '用户名必须大于等于4位'},   
                  {pattern: /^\w+$/, message: '用户名必须是字母、数字或下划线组成'}    
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名"
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('password', {
                rules: [
                  {validator: this.passwordValidator} 
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码"
                />
              )}
            </Item>
            <Item>
              <Button type="primary" block htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Item>
         </Form>
        </section>
      </div>
    );
  }
}
/* 严重注意
  1、暴露的根本不是不是我们定义的Login组件，而是经过加工包装的Login组件
  2、Form.creat()调用返回一个函数，该函数加工了Login组件，生成了一个新组件
      新组件实例对象的props多了一个强大的form属性，能完成验证的一系列操作
  3、我们暴露出去的不是Login组件，而是通过Login生成的一个新组件
***/
export default Form.create()(Login)


