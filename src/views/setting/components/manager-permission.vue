<template>
  <el-dialog title="分配权限" :visible="dialogvisible" :before-close="handleClose">
    <!-- <el-tree ref="permTree" :data="permData" /> -->
    <!-- show-checkbox        节点是否可被选择 checkbox 出现
         
         default-expand-all   默认展开
         props                配置选项
         default-checked-keys 默认选中的节点
         check-strictly       父子不联动

    如果需要通过 key 来获取或设置，则必须设置node-key-->
    <el-tree
      ref="permTree"
      :data="permData"
      show-checkbox
      :props="defaultProps"
      :default-checked-keys="selectedKyes"
      :default-expand-all="true"
      :check-strictly="true"
      node-key="id"
    />

    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="sureAdd" v-loading="loading">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils/index'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  name: 'HrsaasManagerPermission',
  props: {
    dialogvisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      // 准备好假数据
      permData: [],
      selectedKyes: [],
      userId: '',
      defaultProps: {
        label: 'name',
      },
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogvisible', false)
    },
    async getPermissionList(id) {
      try {
        this.userId = id
        // console.log('id', id)
        const res = await getPermissionList()
        const { permIds } = await getRoleDetail(id)
        // console.log('1212', permIds)
        this.permData = tranListToTreeData(res, '0')
        this.selectedKyes = permIds
      } catch (error) {
        console.log(error)
      }
    },
    async sureAdd() {
      this.loading = true
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.userId,
      })
      this.$message.success('角色分配成功')
      this.handleClose()
      this.loading = false
    },
  },
}
</script>
