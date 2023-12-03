<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i class="el-icon-info"></i>
        <span style="margin-left: 5px;">系统公告</span>
      </div>
      <div v-for="(item, index) in notices" :key="index" class="text item">
        <div class="notice-title">{{ item.title }}</div>
        <div class="notice-time">{{ item.time }}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notices: [
        {
          title: '列表内容 1',
          time: '2020-01-01 10:00:00'
        },
        {
          title: '列表内容 2',
          time: '2020-01-02 11:02:11'
        },
        {
          title: '列表内容 3',
          time: '2020-01-03 12:00:00'
        },
        {
          title: '列表内容 4',
          time: '2020-01-04 13:00:00'
        }
      ]
    }
  },
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