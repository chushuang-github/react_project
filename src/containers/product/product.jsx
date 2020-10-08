import React,{Component} from 'react'
import { Card, Button, Icon, Select, Input, Table, message } from 'antd'
import {connect} from 'react-redux'
import {reqProductCategory, reqUpdateProdStatus, reqSearchProduct} from '../.././api'
import {createSaveProductAction} from '../../redux/action_creators/product_action'

const { Option } = Select;
 
class Product extends Component{
  state = {
    productList:[],         //获取产品列表(分页的)
    total:'',               //一共多少条数据
    current:1,               //当前在哪一页
    keyWord: '',             //搜索时的关键词
    searchType: 'productName'      //搜索类型，一上来是按名称搜索的
  }

  componentDidMount(){
    this.getProductCategory()
  }

  //获取产品分类列表
  //这里将搜索返回的数据和初始化的数据整合到一个函数里面，通过isSearch标识去判断
  getProductCategory = async(number=1) => {
    let result
    if(this.isSearch){
      const {searchType,keyWord} = this.state
      result = await reqSearchProduct(number,3,searchType,keyWord)
    }else{
      //第一个参数是第几页，第二个参数是每一页多少数据
      result = await reqProductCategory(number,3)
    }
    const{status,data} = result
    if(status === 0){
      this.setState({
        productList:data.list,
        total:data.total,
        current:data.pageNum
      })
    }else{
      message.error('获取商品列表失败',1)
    } 
    //把获取的商品列表存入redux中,方便后面的展示详情，避免再次向服务器发起请求
    this.props.saveProduct(data.list)
  }

  //点击搜素按钮
  search = async() => {
    this.isSearch = true
    this.getProductCategory()
  }

  //更新商品状态，对产品进行上架和下架操作
  //这里的status是初始状态，我们需要的更新后产品的状态
  updateProdStatus = async({_id,status}) => {
    let productList = [...this.state.productList]
    if(status === 1){
      status = 2
    }else{
      status = 1
    }
    let result = await reqUpdateProdStatus(_id,status)
    if(result.status === 0){
      message.success('更新商品状态成功',1)
      productList = productList.map((item) => {
        if(item._id === _id){
          item.status = status
        }
        return item
      })
      this.setState({productList})
    }else{
      message.error('更新商品状态失败',1)
    }
  }

  render(){
    const dataSource = this.state.productList
    const columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        align: '20%'
      },
      {
        title: '商品描叙',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price',
        render: (price) =>  '￥'+price,
        align: 'center',
        width: '12%'
      },
      {
        title: '状态',
        //写了dataIndex后，下面的render函数中的参数就是dataIndex的属性值
        //dataIndex: 'status',
        key: 'status',
        render: (item) => {
          return (
            <div>
              <Button 
                type={item.status===1? "danger":"primary"}
                onClick={() => {this.updateProdStatus(item)}}
              >
                {item.status===1? '下架':'上架'}
              </Button><br/>
              <span>{item.status===1? '在售':'已停售'}</span> 
            </div>
          )
        },
        align: 'center',
        width: '12%'
      },
      {
        title: '操作',
        // dataIndex: 'opera',
        key: 'opera',
        render: (item) => {
          return (
            <div>
              <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/detail/${item._id}`)}}>
                详情
              </Button><br/>
              <Button type="link" onClick={()=>{this.props.history.push(`/admin/prod_about/product/add_update/${item._id}`)}}>
                修改
              </Button> 
            </div>
          )
        },
        align: 'center',
        width: '12%'
      }
    ];
    return (
      <Card 
        title={
          <div>
            <Select defaultValue="productName" onChange={(value)=>{this.setState({searchType:value})}}>
              <Option value="productName">按名称搜索</Option>
              <Option value="productDesc">按描叙搜索</Option>
            </Select>
            <Input 
              style={{width: '20%', margin: '0px 10px'}} 
              placeholder="请输入搜索关键字"
              allowClear={true}      //可以点击清除图标删除内容,true可以写，也可以不写
              onChange={(event) => {this.setState({keyWord:event.target.value})}}         
            />
            <Button type="primary" onClick={this.search}><Icon type="search"/>搜索</Button>
          </div>        
        }
        extra={
          <div>
            <Button type="primary" onClick={()=>{this.props.history.push('/admin/prod_about/product/add_update')}}>
              <Icon type="plus-circle"/>
              添加商品
            </Button>
          </div>}
      >
        <Table 
          dataSource={dataSource} 
          columns={columns} 
          bordered
          rowKey='_id'   //告诉表格唯一的标识别找key属性了，找每一行的_id，   
          //table里面有一个默认的分页器，如果不是使用table，就要自己从antd引入分页器Patination
          pagination={{
            total:this.state.total,            //一个多少条数据   
            pageSize:3,                        //每一页多少条数据
            current:this.state.current,        //当前页数
            onChange:this.getProductCategory   //onChange默认传的参数就是当前的页码数
          }}
        />
    </Card>
    )
  }
}
export default connect(
  state => ({}),
  {
    saveProduct: createSaveProductAction
  }
)(Product)