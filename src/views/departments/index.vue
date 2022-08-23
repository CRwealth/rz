<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <treeTools :tree-node="company" :is-root="false" @addDepts="addDept" />
        <!--放置一个属性   这里的props和我们之前学习的父传子 的props没关系-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- 说明el-tree里面的这个内容 就是插槽内容 => 填坑内容  => 有多少个节点循环多少次 -->
          <!-- scope-scope 是 tree组件传给每个节点的插槽的内容的数据 -->
          <!-- 顺序一定是 执行slot-scope的赋值 才去执行 props的传值 -->
          <treeTools slot-scope="{ data }" :tree-node="data" @addDepts="addDept" />

        </el-tree>

      </el-card>
      <add-dept :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
    </div>

  </div>
</template>

<script>
import treeTools from './compoents/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDept from './compoents/add-dept.vue' // 引入新增部门组件

export default {
  name: 'Hrsaas1Index',
  components: {
    treeTools,
    AddDept
  },

  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false,
      currentNode: {}
    }
    // 点击子部门 弹出弹框
  },

  mounted() {

  },

  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()

      this.company = { name: result.companyName, manager: result.companyManage, id: '' }
      this.departs = tranListToTreeData(result.depts, '')
      // console.log(result)
    },
    addDept(node) {
      this.currentNode = node // 保存当前的节点
      this.dialogVisible = true // 弹窗显示出来
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
