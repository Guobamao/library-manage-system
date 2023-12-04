<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-info"></i>
        <span style="margin-left: 5px;">系统公告</span>
      </div>
      <div v-for="(item, index) in noticeData.records" :key="index" class="text item" @click="showInfo(item)">
        <div class="notice-topic">{{ item.topic }}</div>
        <div class="notice-time">{{ item.createDate }}</div>
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
          this.$message.error(res.data.msg)
        }
      })
    },
    showInfo(item) {
      this.$alert(item.content, item.topic, {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true,
        callback: () => {}
      });
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
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;
  line-height: 30px;
  padding: 7px 16px;
  cursor: pointer;
  transition: all .2s ease-in-out;
}
.item:hover {
  background-color: #f6f6f6;
}
.notice-time {
  font-size: 12px;
  color: #999;
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