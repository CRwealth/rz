<template>
  <div>
    <el-upload
      v-loading="loading"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="change"
      :http-request="oRequest"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="limit"
      :class="`${fileList.length === limit ? 'hideCard':''}`"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog
      title="图片预览"
      :visible.sync="previewImgDialogVisible"
    >
      <img style="width: 100%" :src="imgUrl">
    </el-dialog>
  </div>
</template>

<script>
// 点击组件上传图片
//
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDOfi3dz7P3TeaG5KK5aqrdARUHp8Bzl4A',
  SecretKey: 'uYx71g5FApFQL8h18zby6FsGOGtHQJxL'
})
console.log(cos)
export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    beforeUploadCheck: Function
  },

  data() {
    return {
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' },
        // { name: 'default1', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      previewImgDialogVisible: false,
      imgUrl: '',
      loading: false
    }
  },

  methods: {
    change(file, fileList) {
      // file 当前的操作的文件对象
      // fileList 组件维护 file 列表
      this.fileList = fileList
      // 文件改变 上传成功和失败都会触发他的
    },
    // action 放接口地址 必填
    // oRequest 自定义上传的行为
    oRequest(data) {
      // data.file 代表当前上传的文件 给后端的数据
      // console.log('====', data)
      this.loading = true
      cos.putObject({
        Bucket: 'mhh-harss-32-1313544704', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-beijing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // 这个就是上传的百分比
          // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        console.log(err || data)
        this.loading = false
        if (err || data.statusCode !== 200) {
          return this.$message.error('图片上传有误，请重新尝试')
        }
        this.$emit('onSuccess', {
          url: 'https://' + data.Location
        })
      })
    },
    onRemove(file, fileList) {
      // file 当前的操作的文件对象
      // fileList 组件维护 file 列表
      console.log('file', file)
      console.log('fileList', fileList)
      this.fileList = fileList
    },
    onPreview(file) {
      console.log(file.url)
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    // beforeUpload
    // ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', "image/svg+xml"]
    // 5Mb
    beforeUpload(file) {
      // console.log(file)
      // if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
      //   return false
      // }
      // 一般分两种情况
      // 自定义 完全 ==》所有的逻辑取决于 自定义， 自定义和默认是相互排斥的
      // if (this.beforeUploadCheck) {
      //   return this.beforeUploadCheck(file)
      // }
      // 自定义 完全 ==》所有的逻辑取决于 先自定义 再默认， 自定义和默认是不相互排斥的

      // if (this.beforeUploadCheck && !this.beforeUploadCheck(file)) {
      //   return false
      // }

      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png', 'image/svg+xml']
      if (!types.includes(file.type)) {
        this.$message.error(`请选择以下${types.join(',')}图片格式`)
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error(`文件最大5MB`)
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
.hideCard {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
