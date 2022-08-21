<template>
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
          <roleDialog :dialog-visible.sync="dialogVisible" />
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
            <el-button type="success" size="medium">分配权限</el-button>
            <el-button type="primary" size="medium">编辑</el-button>
            <el-button type="danger" size="medium">删除</el-button>
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
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
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
      dialogVisible: false
    }
  },

  mounted() {
    this.getRoleList()
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
