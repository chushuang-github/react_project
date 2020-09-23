import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
import App from './App';

ReactDOM.render(
  //顶级组件Provider包裹路由器BrowserRouter
  //使用了Provider，组件中传了参数store，让所有容器组件都可以看到 store
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>, 
  document.getElementById('root')
);

