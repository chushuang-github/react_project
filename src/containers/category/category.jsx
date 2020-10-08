import React,{Component} from 'react'
import { Card, Button, Icon, Table, message, Modal, Form, Input } from 'antd'
import {reqCategoryList, reqAddCategory, reqUpdateCategory} from '../../api/index'
import {connect} from 'react-redux'
import {createSaveCategoryAction} from '../../redux/action_creators/category_action'
const {Item} = Form

class Category extends Component{
  state = {
    category: [],           //商品分类列表
    visible: false,         //控制弹窗的展示和隐藏
    operationType: '',      //操作类型(新增或者修改)
    isLoading:true,         //页面是否处于加载中，控制Table里面的属性
    modalCurrentValue: '',  //弹窗显示的值，数据回显：修改分类的时候使用
    modalCurrentId: ''      //修改分类的时候，服务器中需要id要寻找文档对象
  }

  componentDidMount(){
    //一上来就请求商品分类列表
    this.getCategoryList()
  }
  
  //获取商品分类
  getCategoryList = async() => { 
    let result = await reqCategoryList()
    this.setState({isLoading:false})  //商品列表一旦加载完毕，table就停止加载
    const {status,data,msg} = result
    if(status === 0){
      //数组倒置放入是为了将后加的数据放在前面展示，和后面的添加分类对应
      this.setState({category:data.reverse()})
      //把商品的分类信息放入redux
      this.props.saveCategory(data)
    }else{
      message.error(msg, 1)
    }
  }

  //用于展示新增弹窗
  showAdd = () => {
    this.setState({
      operationType: 'add',
      visible: true,
      modalCurrentValue: '',
      modalCurrentId: ''
    });
  };
  //用于展示修改分类弹窗，并且做数据回显的效果
  //怎么把东西带到弹窗里面去，我们要借助状态
  showUpdate = (item) => {
    const {name,_id} = item
    this.setState({
      operationType: 'update',
      visible: true,
      modalCurrentValue:name,
      modalCurrentId: _id     
    });
  }
  //用于增加分类：添加分类成功要更新状态，只有更新状态页面中才会立即显示
  toAdd = async(categoryName) => {
    let result = await reqAddCategory(categoryName)
    const {status,data,msg} = result   //data为添加进去的对象
    if(status === 0){
      message.success('添加分类成功',1)
      const category = [...this.state.category]
      category.unshift(data)
      this.setState({category})
      this.setState({visible: false});   //隐藏弹窗 
      this.props.form.resetFields()      //重置表单
    }else{
      message.error(msg,1)
    }
  }
  //用于修改分类
  toUpdate = async (categoryId,categoryName) => {
    let result = await reqUpdateCategory(categoryId,categoryName)
    const {status,msg} = result
    if(status === 0){
      message.success('修改分类名称成功',1)
      this.getCategoryList()    //更新成功，重写获取分类列表，分类列表中会更新状态
      this.setState({visible: false});   //隐藏弹窗 
      this.props.form.resetFields()      //重置表单
    }else{
      message.error(msg,1)
    }
  }

  //点击弹窗ok按钮的回调
  //无论你点击ok还是取消，都表示你和弹窗的交互完成了，所以都要关掉弹窗
  handleOk = () => {
    const {operationType} = this.state
    //对表单进行验证
    //如果表单输入错误，不会重置表单，也不会隐藏弹窗
    //如果表单输入正确，就会判断你到底要干嘛，之后联系服务器，隐藏重置操作
    this.props.form.validateFields((err, values) => {
      if(err){
        message.warning('表单输入有误，请检查',1)
        return
      }
      console.log(values)
      //添加分类需要传分类的名称
      if(operationType === 'add') this.toAdd(values.categoryName)
      //修改分类需要拿到分类的id和分类名称，因为服务器中需要id来寻找修改的文档对象是哪一个
      if(operationType === 'update'){
        this.toUpdate(this.state.modalCurrentId,values.categoryName)
      }
    })
  };
  //点击弹窗取消按钮的回调
  handleCancel = () => {
    //点击确认和取消按钮，都会重置表单
    this.props.form.resetFields()
    this.setState({
      visible: false,   //设置为false，隐藏弹窗
    });
  };

  render(){
    const dataSource = this.state.category
    let {visible, operationType} = this.state
    let {getFieldDecorator} = this.props.form
    // this.state.category.forEach((item) => {
    //   dataSource.push({key: item._id, name: item.name})
    // })   可以这样写
    const columns = [
      {
        title: '分类名称',
        //dataIndex后面的属性值和dataSource数组中的属性是一一对应的
        dataIndex: 'name',
        key: 'name',
      }, 
      {
        title: '操作',
        //这个属性是可以和render配合使用，这个属性值写什么，render中的参数就是谁
        //如果不写dataIndex这个属性，render就展示一个对象
        // dataIndex: 'categoryName',
        //这个函数可以接收参数，属性名必须是render,我们来打印一下这个参数是什么样子的
        //我们的修改分类和添加分类复用了一个模态框
        render: (item)=>{return(<Button type="link" onClick={()=>{this.showUpdate(item)}}>修改分类</Button>)},
        key: 'age',
        width: '25%',      //操作这一列的宽度
        align: 'center'    //居中显示
      },    
    ];
    return ( 
      <div>
        <Card
          extra={<Button type="primary" onClick={this.showAdd}><Icon type="plus"/>添加</Button>}
        >
          <Table    //属性的设置都参考api文档，找到自己需要的属性
            dataSource={dataSource} 
            columns={columns} 
            bordered={true}              //加边框
            rowKey="_id"                 //表格行 key 的取值
            //showQuickJumper：有一个跳转到多少页的效果
            pagination={{pageSize:5, showQuickJumper:true}}    //分页器,值是一个对象，第一个{}表示要写js表达式了
            loading={this.state.isLoading}   //页面是否加载
          />
        </Card>
        <Modal      //antd里面的模态框
          title={operationType === 'add' ? '新增分类' : '修改分类'}
          visible={visible}
          cancelText='取消'
          okText='确认'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form className="login-form">
            <Item>
              {getFieldDecorator('categoryName', {
                initialValue: this.state.modalCurrentValue,
                rules: [{required: true, message: '分类名不能为空' }]
              })(
                <Input placeholder="请输入分类名" />
              )}
            </Item>
         </Form>
        </Modal>
      </div>
    )
  }
}
export default connect(
  state => ({}),
  {
    saveCategory: createSaveCategoryAction
  }
)(Form.create()(Category))