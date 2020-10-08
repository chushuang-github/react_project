import React,{Component} from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {BASE_URL} from '../../config'
import {reqDeletePicture} from '../../api'

//将图片变成base64的编码形式
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {
  state = {
    previewVisible: false,    //是否展示预览框(Modal)
    previewImage: '',         //图片URL地址或者图片的base64编码，在模态框中显示
    fileList: []              //收集好的所有的上传完毕的图片
  };
  //关闭预览框
  handleCancel = () => this.setState({ previewVisible: false });

  //展示预览框,你在哪个图片上点击预览，file就是这个点击预览的图片对象
  //file.originFileObj就是图片对象，让getBase64这个函数取加工
  handlePreview = async (file) => {
    //如果图片没有url，也没有转化成base64，那么调用如下方法把图片转成base64
    if (!file.url && !file.preview) {
      //在file中加一个preview属性，这个属性的值就是预览图片的base64的编码
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      //如果预览的图片有url，优先使用图片的url，如果没有url，就使用刚才转化的base64
      //有url，用在线的地址去预览图片，没有url，打成base64去预览
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //当图片状态发生改变的时候调用，我们在上传图片的时候调用这个方法(删除的时候也会调用)
  //我们点击删除的按钮是假删除，因为服务器中的图片不会真正的删除，下面我们做真删除
  //我们接受参数的时候使用解构赋值，将fileList提取出来，上传的图片会自动push到fileList数组中
  //file这个属性是极其动态的，当你上传文件的时候，file就是你上传的那个图片
  //当你删除图片的时候，file就是你要删除的图片，file是非常牛逼的存在
  handleChange = async ({ fileList,file }) => {
    //若文件上传成功
    if(file.status === 'done'){
      console.log(file.response.data.url)
      // file.url = file.response.data.url  不行
      //在fileList里面添加的file中不会有url属性，所以预览的时候都会打成base64来观看
      //写了下面这句话，我们预览的时候就是访问图片的url地址，而不是base64编码了
      fileList[fileList.length-1].url = file.response.data.url
      //将服务器给图片重新命的名赋给我们上传的图片，更改图片本身的名字
      fileList[fileList.length-1].name = file.response.data.name
    }
    //如果文件处于被移除状态，点击删除按钮的时候，状态是removed
    if(file.status === 'removed'){
      //发送请求，在服务器删除图片(真删除)，图片的名字就是图片的唯一标识
      let result = await reqDeletePicture(file.name)
      const {status,msg} = result
      if(status === 0) message.success('图片删除成功',1)
      else message.error(msg,1)
    }
    this.setState({ fileList })
  }

  //从fileList中提取出所有该商品对应的图片的名字，构建一个数组，提供给新增商品使用
  //当AddUpdate组件中点击提交按钮的使用，需要调用它的子组件PictureWall中的这个方法
  //父组件需要调用子组件中的方法，不能使用redux，因为redux只能保存静态的状态
  getImgArr = () => {
    let result = []
    this.state.fileList.forEach((item) => {
      result.push(item.name)
    })
    return result
  }

  //用于点击修改时，初始化展示图片
  setFileList = (imgArr) => {
    let fileList = []
    imgArr.forEach((item,index) => {
      fileList.push({
        uid: -index,
        url: `${BASE_URL}/upload/${item}`,
        name: item
      })
    })
    this.setState({fileList})
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = ( 
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload   //Upload是上传的意思，上传图片发送请求就在这里面发送请求
          //action就是接收图片的服务器地址，发送上传请求的地址，antd上传图片默认是发post请求
          //上传图片的请求：参数是image，类型是一个图片文件
          action={`${BASE_URL}/manage/img/upload`}   //模板字符串是js语法，所以要用{}包裹
          method="post"    //发送请求的方式。如果不写，默认是post
          //发送到后台的文件参数名，也就是参数的key，参数的value就是图片文件，antd已经帮你处理好了
          name="image"     
          listType="picture-card"    //控制照片墙的展示样式
          fileList={fileList}        //图片列表，是一个数组，数组里面包含多个图片对象
          onPreview={this.handlePreview}  //点击预览图标或文件链接的回调
          onChange={this.handleChange}  //图片状态改变的回调(图片上传中，图片被删除，图片成功上传)
          // disabled  禁止上传图片
        >
        {/*隐藏上传图片按钮的数量阈值，控制一次最多可以展示多少图片，超过多少张图片，上传图片按钮就会隐藏*/}
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        {/*当模态框不需要展示底部按钮的时候，可以使用footer=null这个属性*/}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
