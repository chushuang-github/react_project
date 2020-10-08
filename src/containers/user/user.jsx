import React, { Component } from 'react';
import {Card, Button, Icon, Table, message, Modal, Form, Input, Select} from 'antd'
import {reqUserListAndRole,reqAddUser,reqDeleteUser, reqUpdateUser} from '../../api'
import dayjs from 'dayjs'
const {Item} = Form
const {confirm} = Modal
const {Option} = Select

 
class User extends Component{

  state = {
    isShowAdd: false,   //用于控制是否展示新增弹窗
    userList: [],  //用户列表
    roleList: [],   //角色列表
    operaType:'',  //操作类型
    user:{}   //用户信息，用于修改用户，进行数据回显
  }
  componentDidMount(){
    this.getUserListAndRole()
  }

  //请求用户列表和角色列表(服务器用一个路由，返回角色的用户)
  getUserListAndRole = async () => {
    let result = await reqUserListAndRole()
    const {status,msg,data} = result
    if(status === 0){
      this.setState({
        userList:data.users.reverse(),
        roleList:data.roles
      })
    }else{
      message.error(msg,1)
    }
  }
  
  //新增用户弹窗--> 确定按钮回调
  handleOk = () => {
    this.props.form.validateFields(async(err,values) => {
      if(err) return
      let result
      if(this.state.operaType === 'create'){
        result = await reqAddUser(values)
      }else{
        console.log(values,'更新')
        result = await reqUpdateUser({...values,_id:this.state.user._id})
      }
      const {status,msg} = result
      if(status === 0){
        message.success('操作成功',1)
        this.getUserListAndRole()
        this.setState({isShowAdd:false})
      }else{
        message.error(msg,1)
      }
    })
  }
  //新增用户弹窗--> 取消按钮回调
  handleCancel = () => {
    this.setState({isShowAdd:false})
  }
  //删除用户
  deleteUser = (user) => {
    confirm({
      title: `确认删除${user.username}用户吗？`,
      onOk: async() => {
        let result = await reqDeleteUser(user._id)
        const {status,msg} = result
        if(status === 0){
          message.success('删除用户成功',1)
          this.getUserListAndRole()
        }
        else message.error(msg,1)
      },
      onCancel() {},
    })
  }
  //更新用户信息
  updateUser = (user) => {
    this.props.form.resetFields()
    this.setState({
      isShowAdd:true,
      operaType:'update',
      user
    })
  }
  //创建用户
  createUser = () => {
    this.props.form.resetFields()
    this.setState({
      isShowAdd:true,
      operaType:'create',
      user:{}
    })
  }

  render(){
    const dataSource = this.state.userList
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss')
      },
      {
        title: '所属角色',
        dataIndex: 'role_id',
        key: 'role_id',
        render: (id) => {
          let result = this.state.roleList.find((item) => {
            return item._id === id
          })
          if(result) return result.name
        }
      },
      {
        title: '操作',
        key: 'option',
        render: (user) => (
          <div>
            <Button type="link" onClick={()=>{this.updateUser(user)}}>修改</Button>
            <Button type="link" onClick={()=>{this.deleteUser(user)}}>删除</Button>
          </div>
        )
      }
    ]
    const {getFieldDecorator} = this.props.form
    const {operaType,user} = this.state
    return (
      <div>
        <Card 
          title={
            <Button type="primary" onClick={()=>{this.createUser()}}>
              <Icon type="plus"/>创建用户
            </Button>
          }
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{defaultPageSize:4}}
            rowKey="_id"
          />
        </Card>
        <Modal
          title={operaType === 'update'  ? '修改用户':'创建用户'}
          visible={this.state.isShowAdd}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form labelCol={{span:4}} wrapperCol={{span:16}}>
            <Item label="用户名">
              {getFieldDecorator('username', {
                initialValue:user.username || '',
                rules: [{required: true, message: '用户名必须输入'}]
              })(<Input placeholder="请输入用户名"/>)}
            </Item>
            <Item label="密码">
              {getFieldDecorator('password', {
                initialValue:'',
                rules: [{required: true, message: '密码必须输入'}]
              })(<Input placeholder="请输入密码"/>)}
            </Item>
            <Item label="手机号">
              {getFieldDecorator('phone', {
                initialValue:user.phone || '',
                rules: [{required: true, message: '手机号必须输入'}]
              })(<Input placeholder="请输入手机号"/>)}
            </Item>
            <Item label="邮箱">
              {getFieldDecorator('email', {
                initialValue:user.email ||'',
                rules: [{required: true, message: '邮箱必须输入'}]
              })(<Input placeholder="请输入邮箱"/>)}
            </Item>
            <Item label="角色">
              {getFieldDecorator('role_id', {
                initialValue:user.role_id || '',
                rules: [{required: true, message: '必须选择一个角色'}]
              })(
                <Select placeholder="请选择一个角色">
                  {
                    this.state.roleList.map((item) => {
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
            </Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(User)