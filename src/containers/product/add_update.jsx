import React, { Component } from 'react'
import {Card,Button,Icon,Form,Input,Select, message} from 'antd'
import {connect} from 'react-redux'
import {reqCategoryList,reqAddProduct,reqProductById,reqUpdateProduct} from '../../api'
import PicturesWall from './picture_wall'
import RichTextEditor from './rich_text_editor'

const {Item} = Form
const {Option} = Select
class AddUpdate extends Component {
  state = {
    categoryList:[],   //商品分类的列表
    operaType:'add',    //默认操作类型是添加商品
    categoryId:'',
    name:'',
    desc:'',
    price:'',
    detail:'',
    imgs:[],
    _id:''     //修改商品需要带着id去联系服务器
  }
  componentDidMount(){
    //先从redux中取，看redux中有没有分类列表，如果没有，就向服务器发送请求
    const {categoryList,productList} = this.props
    const {id} = this.props.match.params
    if(categoryList.length) this.setState({categoryList})
    else this.getCategoryList()
    //如果有id，就是修改商品
    if(id){
      this.setState({operaType:'update'})
      //先从redux中寻找商品列表
      if(productList.length){
        let result = productList.find((item) => {
          return item._id === id
        })
        if(result){
          this.setState({...result})
          this.refs.pictureWall.setFileList(result.imgs)
          this.refs.rictTextEditor.setRichText(result.detail)  //调用子组件方法
        }
      }else{
        this.getProductInfo(id)
      }
    }
  }
  //根据id获取产品的信息，用于修改商品是，进行数据回显
  getProductInfo = async (id) => {
    let result = await reqProductById(id)
    const {status,data} = result
    if(status === 0){
      //请求商品信息成功，将数据维护进入状态中，进行数据回显
      this.setState({...data})
      this.refs.pictureWall.setFileList(data.imgs)
      this.refs.rictTextEditor.setRichText(data.detail)  //调用子组件方法
    }else{
      message.error('获取商品信息失败',1)
    }
  }

  //发送请求获取分类列表
  getCategoryList = async() => {
    let result = await reqCategoryList()
    const {data,status,msg} = result
    if(status === 0) this.setState({categoryList:data})
    else message.error(msg,1)
  }

  //表单提交,antd中可以使用validateFields收集表单数据，和表单数据的验证
  handleSubmit = (event) => {
    event.preventDefault()
    //从上传组件中获取已经上传的图片名数组
    //组件中也可以添加ref属性，在父组件中可以通过ref调用子组件中的方法
    let imgs = this.refs.pictureWall.getImgArr()
    //从富文本组件中获取用户输入的文字转化为富文本的字符串
    let detail = this.refs.rictTextEditor.getRichText()
    const {_id,operaType} = this.state
    this.props.form.validateFields(async(error,values) => {
      if(error) return
      let result
      //如果operaType的值是add，就是添加请求。否则就是修改请求
      if(operaType === 'add'){
        result = await reqAddProduct({...values,imgs,detail})
      }else{
        result = await reqUpdateProduct({...values,imgs,detail,_id})
      }
      const {status,msg} = result
      if(status === 0){
        message.success('操作成功',1)
        this.props.history.replace('/admin/prod_about/product')
      }else{
        message.error(msg,1)
      }
    })
  }

  render(){
    //getFieldDecorator包装Form组件
    const {getFieldDecorator} = this.props.form
    const {operaType} = this.state
    //左上角返回区域
    const title = ( 
      <div>
        <Button type="link" onClick={this.props.history.goBack}>
          <Icon type="arrow-left"></Icon>
          <span>返回</span>
        </Button>
        <span>{operaType==='add'? '商品添加':'商品修改'}</span>
      </div>
    )
    //控制表单左右比例,antd里面把每一项表单分为两个部分
    //第一部分：Item里面的label展示区；第二部分：是真正的内容展示区
    //antd里面默认把屏幕分为24列，正常来说label展示区和内容展示区默认都占24列
    //Form身上的labelCol就是控制label占多少列，wrapperCol就是控制内容区占多少列
    //label前面的红色的*就表示此项为必填项，设置了required就会出现红色的*
    const formItemLayout = {
      labelCol: {
        md: {span: 2}
      },
      wrapperCol: {
        md: {span: 8}
      }
    }
    return (
      <Card title={title}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit} >
          <Item label="商品名称">
            {
              getFieldDecorator('name', {
                initialValue: this.state.name || '',   //state里面有name就用name，没有就用''
                rules: [{required: true, message: '请输入商品名称'}]
              })(
                <Input placeholder="商品名称" />
              )}
          </Item>
          <Item label="商品描述" >
            {
              getFieldDecorator('desc', {
                initialValue: this.state.desc || '',
                rules: [{required: true, message: '请输入商品描述'}]
              })(
                <Input placeholder="商品描述" allowClear/>
              )}
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator('price', {
                initialValue: this.state.price || '',
                rules: [{required: true, message: '请输入商品价格'}]
              })(
                <Input 
                  placeholder="商品价格"
                  addonAfter="元"
                  prefix="￥"
                  type="number"    //这只这个后表单后面会出现一个点击按钮，可以让数字加和减
                />
              )}
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator('categoryId', {
                initialValue: this.state.categoryId || '',
                rules: [{required: true, message: '请选择一个分类'}]
              })(
                <Select>
                  <Option value=''>请选择分类</Option>
                  {
                    this.state.categoryList.map((item) => {
                      return <Option key={item._id} value={item._id}>{item.name}</Option>
                    })
                  }
                </Select>
              )}
          </Item>
          <Item label="商品图片" wrapperCol={{md:10}}>
            <PicturesWall ref="pictureWall"/>
          </Item>
          <Item label="商品详情" wrapperCol={{md:15}}>
            <RichTextEditor ref="rictTextEditor"/>
          </Item>
          <Button type="primary" htmlType="submit" style={{marginLeft:'40px'}}>提交</Button>
        </Form>
      </Card>
    )
  }
}
export default connect(
  state => ({
    categoryList:state.categoryList,
    productList:state.productList
  })
)(Form.create()(AddUpdate))