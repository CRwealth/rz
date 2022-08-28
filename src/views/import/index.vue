<template>
  <div>
    <UploadExcel :on-success="success" /></div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  name: 'Hrsaas1Index',
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    async success({ results }) {
      console.log(this.$route.query.type)
      if (this.type === 'user') {
        // this.type === 'uesr'来自于员工页面
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }

        //  [{入职日期: 43678,姓名: '高大山',工号: 20089,手机号: 13041131879,转正日:43678}]

        // 转换成
        //  [{timeOfEntry: 43678,username: '高大山',workNumber: 20089,mobile: 13041131879,correctionTime:43678}]
        const arr = results.map(ele => { // ele ==> {入职日期: 43678,姓名: '高大山',工号: 20089,手机号: 13041131879,转正日:43678}
          const user = {}
          // Object.keys(ele)  ['入职日期', '姓名', 。。。。]
          Object.keys(ele).forEach(key => {
          // key 入职日期  手机号 姓名
          // userRelations[key]  timeOfEntry  mobile ......
          // {}.属性 {}['属性值' 变量]
          // 入职时间  timeOfEntry      转正时间 correctionTime
            if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
              user[userRelations[key]] = this.formatDate(ele[key], '/')
              return
            }
            user[userRelations[key]] = ele[key]
          })
          // console.log(user) // {timeOfEntry: 43678,username: '高大山',workNumber: 20089,mobile: 13041131879,correctionTime:43678}
          return user
        })
        await importEmployee(arr)
        this.$message.success('批量导入员工成功')
      }

      // 回到上一个页面
      this.$router.back()
    },
    formatDate(numb, format) {
      const time = new Date((numb) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
