<template>
  <el-dialog title="新增员工" :visible="visibleDialog" :before-close="handleClose">
    <!-- 表单 -->
    <el-form ref="addEmployeeDialog" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree v-if="showTree" v-loading="loading" :data="treeData" :props="defaltProps" :default-expand-all="true" @node-click="handleNodeClick" />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button v-loading="loadingBtn" type="primary" size="small" @click="submitEmploy">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    visibleDialog: {
      type: Boolean,
      default: false
    }
  },
  // 用户名必填，username，长度为1-4位
  // 手机号必填，mobile，需满足 正则表达式 /^1[3-9]\d{9}$/
  // 聘用形式必填， formOfEmployment
  // 工号必填，workNumber
  // 部门必填，departmentName
  // 入职时间必填， timeOfEntry
  // 转正时间可选，correctionTime
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      hireType: EmployeeEnum.hireType,
      treeData: [], // 定义数组接收树形数据
      loading: false, // 控制树的显示或者隐藏进度条
      showTree: false, // 控制树形的显示或者隐藏
      loadingBtn: false,
      // 只认lavel所以需要定义
      defaltProps: { label: 'name' },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }, {
          min: 1, max: 4, message: '用户姓名为1-4位'
        }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }, {
          pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur'
        }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 为了防止单项数据流报错
    handleClose() {
      this.$emit('update:visibleDialog', false)
      // 表单重置
      this.$refs.addEmployeeDialog.resetFields()
      // 关闭树状
      this.showTree = false
      // 值清空
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
    },
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    handleNodeClick(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    async submitEmploy() {
      try {
        await this.$refs.addEmployeeDialog.validate()
        this.loadingBtn = true
        // 接口调用
        await addEmployee(this.formData) // 新增员工
        this.$message.success('新增员工成功')
        this.$emit('refresh')
        this.handleClose()
        this.loadingBtn = false
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
