import React, { Component } from 'react'
import {Button, Card, Icon, List, message} from 'antd'
import {connect} from 'react-redux'
import {BASE_URL} from '../../config'
import {reqProductById,reqCategoryList} from '../../api'
import './detail.less'
const {Item} = List

class Detail extends Component {
  state = {
    categoryId:'',
    categoryName:'',
    desc:'',
    detail:'',
    name:'',  
    imgs:[],
    price:'',
    isLoading:true
  }
  componentDidMount(){
    const {id} = this.props.match.params
    //先从redux中获取商品详细信息，如果刷新页面，redux清空，这时候就从服务器中获取商品信息
    const reduxPordList = this.props.productList
    //从redux中读取商品分类列表
    const reduxCateList = this.props.categoryList
    //判断redux中是否有商品列表
    if(reduxPordList.length){
      let result = reduxPordList.find((item) => {
        return item._id === id
      })
      if(result){
        const {categoryId,desc,detail,name,imgs,price} = result
        //this.setState是异步的，所以我们将分离id挂载自身身上，方便后面的商品分类确定
        this.categoryId = categoryId   
        this.setState({categoryId,desc,detail,name,imgs,price})
      } 
    }else{
      this.getProdById(id)
    }
    //判断redux中是否有商品分类列表
    if(reduxCateList.length){
      let result = reduxCateList.find((item) => {
        return item._id === this.categoryId
      })
      this.setState({categoryName:result.name,isLoading:false})
    }else{
      this.getCategoryList()
    }
  }

  //通过商品id获取信息
  getProdById = async(id) => {
    let result = await reqProductById(id)
    const {data,msg,status} = result
    if(status === 0){
      const {categoryId,desc,detail,name,imgs,price} = data  
      this.categoryId = categoryId
      this.setState({categoryId,desc,detail,name,imgs,price})
    }else{
      message.error(msg,1)
    }
  }

  //通过商品id，在分类中找到自己所属的分类
  getCategoryList = async() => {
    let result = await reqCategoryList()
    const {status,data,msg} = result
    if(status === 0){
      let result = data.find((item) => {
        return item._id === this.categoryId
      })
      if(result){
        this.setState({categoryName:result.name,isLoading:false})
      }
    }else{
      message.error(msg,1)
    }
  }
  
  render() {
    return (
      <Card title={(
        <div className='left_top'>
          <Button type="link" size="small" onClick={()=>{this.props.history.goBack()}}>
            <Icon type="arrow-left" style={{fontSize:"17px"}}/>
          </Button>
          <span>商品详情</span>
        </div>
      )}
      >
        <List className="list_item" loading={this.state.isLoading}>
          <Item>
            <span className="prod_title">商品名称：</span> 
            <span >{this.state.name}</span>
          </Item>
          <Item>
            <span className="prod_title">商品描述：</span> 
            <span>{this.state.desc}</span>
          </Item>
          <Item> 
            <span className="prod_title">商品价格：</span>
            <span>{this.state.price}</span>  
          </Item>
          <Item>
            <span className="prod_title">所属分类：</span> 
            <span>{this.state.categoryName}</span>
          </Item>
          <Item>
            <span className="prod_title">商品图片：</span>
            {
              this.state.imgs.map((item,index) => {
                return <img key={index} src={`${BASE_URL}/upload/`+item} alt="商品图片" className="imgs"/>
              })
            }
          </Item>
          <Item>
            <span className="prod_title">商品详情：</span> 
            <span dangerouslySetInnerHTML={{__html:this.state.detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}
export default connect(
  state => ({
    productList:state.productList,
    categoryList:state.categoryList
  }),
  {}
)(Detail)
