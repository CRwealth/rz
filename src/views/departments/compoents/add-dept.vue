<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible.sync="dialogVisible" :before-close="handleClose">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="submitDept">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 部门名称（name）：必填 1-50个字符 / 同级部门中禁止出现重复部门
// 部门编码（code）：必填 1-50个字符 / 部门编码在整个模块中都不允许重复
// 部门负责人（manager）：必填
// 部门介绍 ( introduce)：必填 1-300个字符
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkCodeRepeat = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      // console.log(depts)
      // some 只要一个满足条件就返回 true

      // 1.新增的情况
      // 2.编辑的情况
      // 把我自身这条数据给过滤再去判断
      // 如何把当前这条数据排除掉
      let isRepeat = false
      if (this.formData.id) {
        // const list = depts.filter(ele => ele.id !== this.treeNode.id)
        isRepeat = depts.some(ele => ele.id !== this.treeNode.id && ele.code === value)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }

      isRepeat ? callback(new Error(`部门编码${value}已经存在`)) : callback()
    }
    const checkNameRepeat = async(rules, value, callback) => {
      const { depts } = await getDepartments()
      // this.treeNode 当前部门数据 保存在父组件 从父组件传过来
      // console.log(this.treeNode)
      // 如何判断是否是自己的子部门 就是当前部门的id等于子部门的pid 那么就是属于当前部门的子部门
      // 用 当前节点的ID 判断  === 子部门的pid 如果相等 就是当前部门的子部门 然后返回子部门
      // const list = depts.filter(ele => this.treeNode.id === ele.pid)
      // console.log(list)
      // 开始判断 子部门的名称是否和输入的value值相等
      // const isRepeat = list.some(ele => ele.name === value)
      // 如果相等返回true 那么就验证不通过 如果为false说明验证通过
      let isRepeat = false
      // 编辑的时候 改的就是自己 要注意和自己的兄弟进行对比 ==》同级的比较
      // 如何找到和我同级的数据 this.treeNode.pid =1 自己的兄弟 数据pid =1
      if (this.formData.id) { // 编辑
      // 所有和我同级的数据
        const list = depts.filter(ele => this.treeNode.id !== ele.id && this.treeNode.pid === ele.pid)
        // console.log('list',list);
        isRepeat = list.some(ele => ele.name === value)
      } else {
        // 拿到同级部门的数据
        // 确定了当前部门的ID ==> 这个部门下所有的子部门
        const list = depts.filter(ele => this.treeNode.id === ele.pid)
        isRepeat = list.some(ele => ele.name === value)
      }
      isRepeat ? callback(new Error(`部门名称在同级部门${value}已经存在`)) : callback()
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门名称要求1-300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    handleClose() {
      // 关闭弹窗
      this.$emit('update:dialogVisible', false)
      // 重置表单
      this.$refs.deptForm.resetFields()
      // 初始化数据
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    submitDept() {
      this.$refs.deptForm.validate(async vali => {
        if (vali) {
          // 表单校验通过
          // 新增部门接口
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }

          this.$message.success(`部门${this.formData.id ? '修改' : '新增'}成功`)
          this.$emit('refreshDepts') // 告诉父组件，刷新列表
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style>

</style>
