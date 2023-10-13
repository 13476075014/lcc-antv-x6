/* eslint-disable no-underscore-dangle */
import Vue from 'vue'
import Router from 'vue-router'

const _import = file => () => import(`@/views/${file}.vue`)

Vue.use(Router)
// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export const asyncRouterMap = [
  {
    path: '/',
    component: ()=>import("@/views/index.vue"),
    children: [
      {
        path: 'page1',
        component: _import('page1/index'),
        children: [
          {
            path: 'test1',
            component: _import('page1/test1'),
          },
        ],
      },
      {
        path: 'antv/er',//er图例子
        component: _import('antv-x6/er/index')
      },
      {
        path: 'antv/flowchart',//流程图例子
        component: _import('antv-x6/flowchart/index')
      },
    ],
  },
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: asyncRouterMap,
  mode: 'history',
})
