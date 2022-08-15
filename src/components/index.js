import TextIndex from '@/components/TextIndex'
import Text2index from '@/components/Text2index'

// 对象写法
// export default {
//   install(Vue) {
//     Vue.component('TextIndex', TextIndex)
//     Vue.component('Text2index', Text2index)
//   } }

// 函数写法
const com = [TextIndex, Text2index]
const obj = {

}
export default (Vue) => {
  // Vue.component('TextIndex', TextIndex)
  // Vue.component('Text2index', Text2index)
  com.forEach(ele => {
    Vue.component(ele.name, ele)
  })
  Object.keys(obj).forEach(key => {
    Vue.filter(key, obj[key])
  })
}

