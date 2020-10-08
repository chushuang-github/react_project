import React,{Component} from 'react'
import {Card, Button, Icon, Table, message, Modal, Form, Input, Tree} from 'antd'
import {reqRloeList,reqAddRole,reqAuthRloe} from '../../api'
import dayjs from 'dayjs'
import {connect} from 'react-redux'
import menuList from '../../config/menu_config'
const {Item} = Form
const { TreeNode } = Tree

class Role extends Component{
  state = {
    isShowAdd:false,   //是否展示新增角色弹窗
    isShowAuth:false,   //
    roleList:[],
    checkedKeys: [],  //选中的复选框
    menuList:menuList,
    _id:''  //当前操作的角色id
  } 
  componentDidMount(){
    this.getRoleList()
  }

  //请求角色列表
  getRoleList = async () => {
    let result = await reqRloeList()
    const {status,msg,data} = result
    if(status === 0){
      this.setState({roleList:data})
    }else{
      message.error(msg,1)
    }
  }

  //新增角色-->确认按钮
  //一个函数被async声明了，返回值是一个promise实例对象
  handleOK = () => {
    this.props.form.validateFields(async(err, values) => {
      if(err) return
      let result = await reqAddRole(values.roleName)
      const {status,msg} = result
      if(status === 0){
        message.success('新增角色成功',1)
        this.getRoleList()
        this.setState({isShowAdd:false})
      }else{
        message.error(msg,1)
      }
    })
  }
  //新增角色-->取消按钮
  handleCancel = () => {
    this.setState({isShowAdd:false})
  }

  //授权弹窗-->确认按钮
  handleAuthOK = async () => {
    const {checkedKeys,_id} = this.state
    const {username} = this.props
    let result = await reqAuthRloe({_id, menus:checkedKeys, auth_name:username})
    const {msg,status} = result
    if(status === 0){
      message.success('设置权限成功',1)
      this.setState({isShowAuth:false})
      //也可以从state里面拿到所有的roleList，进行查找，找到_id这个人，替换成data
      //这里我们直接请求一下服务器，拿到所有的roleList
      this.getRoleList()
    }else{
      message.error(msg,1)
    }
  }
  //授权弹窗-->取消按钮
  handleAuthCancel = () => {
    this.setState({isShowAuth:false})
  }

  //展示授权弹窗，并做弹窗的数据回显(点击弹窗，可以看见该角色的权限)
  showAuth = (id) => {
    const {roleList} = this.state  
    let result = roleList.find((item) => {
      return item._id === id
    })
    if(result) this.setState({checkedKeys: result.menus})
    this.setState({
      isShowAuth:true,
      _id:id
    })
  }
  //点击新增按钮展示弹窗，重置表单
  showAdd = () => {
    this.props.form.resetFields()
    this.setState({isShowAdd:true})
  }
  
//----------------------tree start-------------------------

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  renderTreeNodes = data => 
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    })
    
//----------------------tree end------------------------

  render(){
    const dataSource = this.state.roleList
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        //dayjs里面如果不传数据，就显示当前的时间戳，也可以传一个时间戳，对传的时间戳进行处理
        //如果dayjs里面传一个undefined或者不传，都会被dayjs加工成当前的时间戳
        render: (time) => dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss'),
        key: 'create_time',
      },
      {
        title: '授权时间',
        dataIndex: 'auth_time',
        render: (time) => time ? dayjs(time).format('YYYY年 MM月DD日 HH:mm:ss') : '',             
        key: 'auth_time',
      },
      {
        title: '授权人',
        dataIndex: 'auth_name',
        key: 'auth_name',
      },
      {
        title: '操作',
        key: 'option',
        render: (item) => <Button type="link" onClick={()=>{this.showAuth(item._id)}}>设置权限</Button>
      }
    ];

    //treeData是树形菜单的元数据
    const treeData = this.state.menuList

    const {getFieldDecorator} = this.props.form
    return (
      <div>
        <Card
          title={<Button type="primary" onClick={()=>{this.showAdd()}}>
                  <Icon type="plus"/>
                  新增角色
                </Button>}
          style={{width: '100%'}}
        >
          <Table
            dataSource={dataSource}
            columns={columns}
            bordered
            pagination={{defaultPageSize:4}}
            rowKey="_id"
          />
        </Card>
        {/*新增角色提示框*/}
        <Modal
          title="新增角色"
          visible={this.state.isShowAdd}
          onOk={this.handleOK}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form onSubmit={this.handleOK}>
            <Item label="角色名称" labelCol={{md:4}} wrapperCol={{md:20}}>
              {getFieldDecorator('roleName', {
                initialValue:'',
                rules: [
                  {required: true, message: '角色名必须输入'}
                ]
              })(
                  <Input placeholder="请输入角色名"/>
              )}
            </Item>
          </Form>
        </Modal>
        {/*设置权限框*/}
        <Modal
          title="设置权限"
          visible={this.state.isShowAuth}
          onOk={this.handleAuthOK}
          onCancel={this.handleAuthCancel}
          okText="确认"
          cancelText="取消"
        >
           <Tree
            checkable    //节点前添加 Checkbox 复选框
            onCheck={this.onCheck}   //勾选的时候调用此方法
            checkedKeys={this.state.checkedKeys}  //选中的是哪几个复选框
            defaultExpandAll={true}  //展开所有节点
          >
            <TreeNode title='平台功能' key='top'>
              {this.renderTreeNodes(treeData)}
            </TreeNode>
          </Tree>
        </Modal>
      </div>
    )
  }
}
export default connect(
  state => ({username:state.userInfo.user.username}),
  {}
)(Form.create()(Role))