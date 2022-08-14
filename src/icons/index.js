import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)
// require 引入的 node.js中学到的模块
// require.context 方法 可以实现批量导入文件
// require.context(directory, useSubdirectories, regExp)
// directory: 要查找的文件路径
// useSubdirectories: 是否查找子目录
// regExp: 要匹配文件的正则
// 返回一个方法

// 返回的方法 keys 属性
// keys 函数 返回一个数组  返回所有符合要求的地址路径
const req = require.context('./svg', false, /\.svg$/)
// requireContext 是一个形参 然后可以接受函数这个参数  map里面放了这个函数 一一映射
// 就会将每一项都放进去这个函数执行然后就可以获得到当前的模块
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
