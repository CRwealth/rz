<template>
  <el-dialog
    :title="`${roleForm.id? '修改':'新增'}角色`"
    width="60%"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form
      ref="roleDialogForm"
      label-width="80px"
      :model="roleForm"
      :rules="rules"
    >
      <!-- 第二种写法: :rules="[{required:true,message:'角色必填',trigger:'blur'}]" -->
      <el-form-item
        prop="name"
        label="角色"
      >
        <el-input v-model="roleForm.name" placeholder="请输入角色" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="roleForm.description" type="textarea" row="3" placeholder="请输入描述" />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  name: 'HrsaasRoleDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      roleForm: {
        name: '',
        description: ''
      },
      // 第一种写法放在data里
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {

  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      // resetFields()ui里面自带的重置表单 只会对校验的进行重置，需要再写个方法重置描述里面内容
      this.$refs.roleDialogForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submitRole() {
      // 表单校验通过时候
      // validata()
      try {
        await this.$refs.roleDialogForm.validate()
        this.loading = true
        // 新增接口
        this.roleForm.id ? await updateRole(this.roleForm) : await addRole(this.roleForm)
        // 调用父组件里的获取角色列表的方法
        this.$emit('refresh')
        // 提示成功
        this.$message.success(`角色${this.roleForm.id ? '修改' : '新增'}成功`)
        // 弹窗关闭
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }

  }
  // 实现角色新增
  // 新增角色接口写好，引入
  // 点击确定按钮 调用新增接口
  // 新增成功提示数据，刷新角色列表
}
</script>

