//项目的菜单配置，一个更改菜单就更改这个文件
export default [
  {
    title: '首页',
    key: 'home',
    icon: 'home',
    path: '/admin/home'
  },

  {
    title: '商品',
    key: 'prod_about',
    icon: 'appstore',
    children: [
      {
        title: '分类管理',
        key: 'category',
        icon: 'unordered-list',
        path: '/admin/prod_about/category'
      },
      {
        title: '商品管理',
        key: 'product',
        icon: 'tool',
        path: '/admin/prod_about/product'
      }
    ]
  },

  {
    title: '用户管理',
    key: 'user',
    icon: 'user',
    path: '/admin/user'
  },
  {
    title: '角色管理',
    key: 'role',
    icon: 'safety',
    path: '/admin/role'
  },

  {
    title: '图形图表',
    key: 'charts',
    icon: 'area-chart',
    children: [
      {
        title: '柱形图',
        key: 'bar',
        icon: 'bar-chart',
        path: '/admin/charts/bar'
      },
      {
        title: '折线图',
        key: 'line',
        icon: 'line-chart',
        path: '/admin/charts/line'
      },
      {
        title: '饼图',
        key: 'pie',
        icon: 'pie-chart',
        path: '/admin/charts/pie'
      }
    ]
  }
]