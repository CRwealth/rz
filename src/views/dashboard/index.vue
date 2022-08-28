<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <UploadExcel />
    <!-- <a
      href="http://localhost:8888/static/img/login-logo.758b34e9.png"
      download="login-logo.758b34e9.png"
    >点击</a> -->
  </div>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  // direactives 局部注册自定义指令
  // directives: {
  //   // key: value
  //   // key 自定义指令的名称
  //   // value ==》 自定义指令对应的逻辑
  //   color: {
  //     inserted(dom, options, vNode) {
  //       console.log(dom) // dom 指令绑定的元素
  //       console.log(options) // 描述 当前指令信息
  //       console.log(vNode.context) // 可以访问到 当前vue实例的
  //       // 实现 改 当前 dom 元素颜色
  //       dom.style.color = options.value
  //     }
  //   }
  // },

  data() {
    return {
      info: {}
    }
  },

  computed: {
    ...mapGetters([
      'name'
    ])
  },
  mounted() {
    // import('@/vendor/Export2Excel').then(excel => {
    //   excel.export_json_to_excel({
    //     header: {
    //       '手机号': 'mobile',
    //       '姓名': 'username',
    //       '入职日期': 'timeOfEntry',
    //       '聘用形式': 'formOfEmployment',
    //       '转正日期': 'correctionTime',
    //       '工号': 'workNumber',
    //       '部门': 'departmentName'
    //     }, // 表头 必填
    //     data: [[11]], // 具体数据 必填
    //     filename: 'excel-list', // 非必填
    //     autoWidth: true, // 非必填
    //     bookType: 'xlsx' // 非必填
    //   })
    // })
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
