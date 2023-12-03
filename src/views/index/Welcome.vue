<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-info"></i>
        <span style="margin-left: 5px;">系统公告</span>
      </div>
      <div v-for="(item, index) in noticeData.records" :key="index" class="text item">
        <el-table-column label="标题" width="200">
          <el- type="primary" :underline="false" :href="item.url" target="_blank">{{item.topic}}</el->
        </el-table-column>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      noticeData: []
    }
  },
  methods: {
    loadData() {
      axios.get("/notice/page", {
        params: {
          page: 1,
          pageSize: 5
        }
      }).then(res => {
        if (res.data.code === 1) {
          this.noticeData = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>