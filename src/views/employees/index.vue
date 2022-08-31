<template>
  <div class="app-container">

    <PageTools :show-before="true">
      <span slot="before">{{ total }}条数据</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="add">新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" type="index" width="" />
        <el-table-column label="姓名" sortable="" prop="username" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img v-imgerror="require('@/assets/common/bigUserHeader.png')" :src="row.staffPhoto" alt="" style="border-radius:50%;width:100px;height:100px;padding:10px" @click="showErCodeDialog(row.staffPhoto)">
          </template>
        </el-table-column>
        <el-table-column label="工号" sortable="" prop="workNumber" />
        <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formatEmployment" />
        <el-table-column label="部门" sortable="" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <template slot-scope="scope">
            {{ scope.row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>

        <el-table-column label="账户状态" sortable="" prop="enableState">
          <template slot-scope="{row}">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="asRole(row)">角色</el-button>
            <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          v-if="total > 0"
          background
          layout="prev, pager, next, sizes, total"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :total="total"
          :page-sizes="[10,20,30,40]"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <!-- .sync ::visible-dialog="visibleDialog" 和 @updata:visibleDialog="把子组件
    传递过来的值 赋值给 visibleDialog " -->
    <AddDemployee :visible-dialog.sync="visibleDialog" @refresh="getEmployeeList" />
    <el-dialog title="头像二维码" :visible.sync="ercodeDialog" custom-class="canvaseq">
      <canvas id="canvas" />
    </el-dialog>
    <HrsaasAssignRole ref="assiginRole" v-model="assignRoleVisible" :user-id="currentUserId" />
  </div>

</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddDemployee from './components/add-employee'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import HrsaasAssignRole from './components/assign-role.vue'
export default {
  components: {
    AddDemployee,
    HrsaasAssignRole
  },
  data() {
    return {
      visibleDialog: false,
      ercodeDialog: false,
      assignRoleVisible: false,
      currentUserId: '',
      // EmployeeEnum,
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0 // 总数

    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        if (total !== 0 && rows.length === 0) {
          // 说明没有数据  1.真正没有 2.假的没有
          // 把真正没有数据的情况去掉
          // 重新调用接口
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue * 1)
      // 第一种方法
      return obj ? obj.value : '非正式'
      // 第二种方法
      // ?? 是前面值为undefind和null的时候才会执行后面的代码 || 前面只要是假值都会执行，有时候不希望0变成假值就可以用??
      // return obj?.value ?? '非正式'
    },
    add() {
      this.visibleDialog = true
    },
    async del(id) {
      try {
        await this.$confirm('您确定删除该员工吗', '提示', {
          type: 'warning'
        })
        await delEmployee(id)
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel数据
    exportData() {
      //  做操作
      // 表头对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 懒加载
      import('@/vendor/Export2Excel').then(async excel => {
        // 1、获取需要导出的数据
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        // 2、调用自己封装的方法进行数据的转化
        const data = this.fromJson(headers, rows)
        import('@/vendor/Export2Excel').then(excel => {
          excel.export_json_to_excel({
            header: Object.keys(headers), // 表头 必填
            data: data, // 具体数据 必填
            filename: 'excel-list', // 非必填
            autoWidth: true, // 非必填
            bookType: 'xlsx', // 非必填
            multiHeader: [['姓名', '主要信息', '', '', '', '', '']],
            merges: ['A1:A2', 'B1:F1', 'G1:G2']
          })
        })
        // 获取所有的数据

        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
      })
    },
    // 该方法负责将数组转化成二维数组
    fromJson(headers, rows) {
      const result = rows.map(item => {
        return Object.keys(headers).map(key => {
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期 -> 已经定义过过滤器直接使用即可
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 需要引入EmployeeEnum常量进行处理
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '非正式'
          }
          return item[headers[key]]
        })
      })
      return result
    },
    async showErCodeDialog(staffPhoto) {
      // staffPhoto 地址存在的时候
      if (!staffPhoto) return this.$message.error('该用户还未设置头像')
      this.ercodeDialog = true
      await this.$nextTick()
      const dom = document.querySelector('#canvas')
      QrCode.toCanvas(dom, staffPhoto)
    },
    async asRole(row) {
      this.currentUserId = row.id
      await this.$refs.assiginRole.getRoleList()
      this.assignRoleVisible = true
    }
  }
}

</script>

<style lang="scss">
.canvaseq .el-dialog__body {
  text-align: center;
}
</style>
