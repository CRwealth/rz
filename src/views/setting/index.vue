<template>
<<<<<<< HEAD
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="角色管理" name="second">
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="handleAdd"
          >新增角色</el-button>
          <!-- - sync 拆分成 dialogVisible属性 和 update:dialogVisible事件-->
          <!-- roleDialog :dialog-visible='dialogVisible' @update:dialogVisible="接收子组件传递过来的值 改变dialogVisible的值" -->
          <roleDialog ref="roleDialog" :dialog-visible.sync="dialogVisible" @refresh="getRoleList" />
        </el-row>
        <el-table
          v-loading="loading"
          border
          :data="list"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
            width="320"
          >
            <template slot-scope="scope">
              <el-button type="success" size="medium">分配权限</el-button>
              <el-button type="primary" size="medium" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="medium" @click="deleteRole(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="end" style="height:60px" align="middle">
          <el-pagination
            :current-page.sync="page.page"
            background
            layout="total,prev, pager, next,sizes"
            :page-size.sync="page.pagesize"
            :page-sizes="[5,10,20,30]"
            :total="total"
            @current-change="changePage"
            @size-change="changeSize"
          />
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="公司信息">
        <el-alert
          title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
          type="info"
          show-icon
          :closable="false"
        />
        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input v-model="formData.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="formData.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="formData.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
=======
  <div>
    setting
>>>>>>> 3c19ccb7bb4904a6da4ce928ab39c2b11d0f1ea9
  </div>
</template>

<script>
<<<<<<< HEAD
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Hrsaas1Index',
  components: {
    roleDialog
  },

  data() {
    return {
      activeName: 'second',
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      formData: ''
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.list = rows
        this.total = total
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    changePage(val) {
      // val 最新页码
      this.getRoleList()
    },
    changeSize(val) {
      this.getRoleList()
    },
    handleAdd() {
      this.dialogVisible = true
    },
    edit(row) {
      console.log('row', row)
      this.dialogVisible = true
      this.$refs.roleDialog.roleForm = { ...row }
    },
    async deleteRole(id) {
      //  提示
      try {
        await this.$confirm('确认删除该角色吗', '删除提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        })
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
        // 删除成功回到第一页
        this.page.page = 1
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyInfo() {
      try {
        this.formData = await getCompanyInfo(this.companyId)
      } catch (error) {
        console.log(error)
      }
    }
=======
export default {
  name: 'Hrsaas1Index',

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

>>>>>>> 3c19ccb7bb4904a6da4ce928ab39c2b11d0f1ea9
  }
}
</script>

<style lang="scss" scoped>

</style>
