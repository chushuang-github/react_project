import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
//这这个样式是自己手动引入的
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
//自己写的样式，微调一下富文本编辑器的样式
//样式里面调节demo-wrapper和demo-editor这两个类名的样式
// import './demo.less'  

export default class RichTextEditor extends Component {
  state = {
    //构建一个初始化状态的编辑器+内容，初始化的内容是空白，初始化的状态是所有的按钮都未选中
    editorState: EditorState.createEmpty(),  
  }
  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  }; 

  //获取富文本内容，return后面的是复制过来的代码里面的
  getRichText = () => {
    const { editorState } = this.state
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  //用于点击修改时，带着样式的展示商品详情
  setRichText = (html) => {
    //把带着标签的字符串解析成编辑器能认识的带着样式的文本
    const contentBlock = htmlToDraft(html);  
    if (contentBlock) {
      //contentBlock是一个对象，里面有一个contentBlocks(真正存放东西的属性，而且能存放多个)
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({editorState})
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          //下面两个是类名，可以直接通过类名的方式添加样式
          // wrapperClassName="demo-wrapper"  //最外侧容器的样式
          // editorClassName="demo-editor"    //编辑区域的样式
          editorStyle = {{   //通过这个可以直接写编辑区域的样式
            border:'1px black solid',
            paddingLeft: '10px',
            lineHeight:'20px',
            height:'200px'
          }}
          onEditorStateChange={this.onEditorStateChange}
        />
        {//这里面对应的就是富文本，富文本不用给用户看，最终把富文本编辑成html样式展示出来
        /* <textarea
          style={{width:'600px', height:'200px'}}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    );
  }
}