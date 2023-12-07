<template>
    <el-container style="display: flex; flex-direction: column;">
        <el-form :model="searchForm" size="small" :inline="true">
            <el-form-item label="借书卡">
                <el-input v-model="searchForm.readerNumber" placeholder="借书卡"></el-input>
            </el-form-item>
            <el-form-item label="图书名称">
                <el-input v-model="searchForm.bookName" placeholder="图书名称"></el-input>
            </el-form-item>
            <el-form-item label="归还状态">
                <el-select v-model="searchForm.backType" placeholder="归还状态" clearable>
                    <el-option label="正常还书" value="0"></el-option>
                    <el-option label="延迟还书" value="1"></el-option>
                    <el-option label="破损还书" value="2"></el-option>
                    <el-option label="丢失" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="图书状态">
                <el-select v-model="searchForm.status" placeholder="图书状态" clearable>
                    <el-option label="在馆" value="0"></el-option>
                    <el-option label="已借出" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="lendData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="图书名称" width="180">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showBookTimeline(scope.row)">
                        {{ scope.row.book.name }}
                    </el-link>
                    <el-dialog title="借阅时间线" :visible.sync="bookDetailVisible" width="30%">
                        <el-timeline :reverse="true">
                            <el-timeline-item v-for="(item, index) in timelineData" :key="index" :timestamp="item.timestamp" placement="top">
                                <p v-if="item.returned">
                                    <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                                        {{ scope.row.book.name }}
                                    </el-link>
                                    已归还
                                </p>
                                <p v-else>
                                    <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                                        {{ item.realName }}
                                    </el-link>
                                    借阅了
                                    <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                                        {{ scope.row.book.name }}
                                    </el-link>
                                </p>
                            </el-timeline-item>
                        </el-timeline>
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column label="借书卡" prop="reader.readerNumber" width="150"></el-table-column>
            <el-table-column label="借阅人" prop="reader.realName" width="100">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showReaderHistory(scope.row)">
                    {{ scope.row.reader.realName }}</el-link>
                    <el-dialog title="借阅时间线" :visible.sync="readerHistoryVisible" width="30%">
                        <el-timeline :reverse="true">
                            <el-timeline-item v-for="(item, index) in readerHistoryData" :key="index" :timestamp="item.timestamp" placement="top">
                                <p>
                                    <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                                        {{ item.realName }}
                                    </el-link>
                                    借阅了
                                    <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                                        {{ scope.row.book.name }}
                                    </el-link>
                                </p>
                            </el-timeline-item>
                        </el-timeline>
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column label="借阅时间" prop="lendDate" width="200"></el-table-column>
            <el-table-column label="还书时间" prop="backDate" width="200"></el-table-column>
            <el-table-column label="归还状态" prop="backType" width="100">
                <template slot-scope="scope">
                    <!-- 如果status没有值则显示在借中 -->
                    <el-tag :type="status[scope.row.backType] || 'info'">{{ status_text[scope.row.backType] || '在借中'
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="deleteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="lendData.total">
            </el-pagination>
        </div>
    </el-container>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            searchForm: {
                readerNumber: '',
                bookName: '',
                backType: '',
                status: ''
            },
            lendData: [],
            status: ['primary', 'success', 'warning', 'danger'],
            status_text: ['已借阅', '已归还', '已超期', '已丢失'],
            bookDetailVisible: false, // 图书借阅时间线弹窗
            readerHistoryVisible: false, // 读者借阅历史弹窗
            timelineData: [], // 时间线数据
            readerHistoryData: [], // 读者借阅历史数据
        }
    },
    methods: {
        loadData() {
            axios
                .get("/lend/page", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.lendData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        search() {
            axios
                .get("/lend/page", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                        readerNumber: this.searchForm.readerNumber,
                        bookName: this.searchForm.bookName,
                        backType: this.searchForm.backType,
                        status: this.searchForm.status
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.lendData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.loadData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        },
        showBookTimeline(item) {
            axios.get('/lend/timeline', {
                params: {
                    bookId: item.bookId
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.timelineData = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            this.bookDetailVisible = true
        },
        showReaderHistory(item) {
            axios.get('/lend/history', {
                params: {
                    readerId: item.readerId
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.readerHistoryData = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            this.readerHistoryVisible = true
        },
        deleteById(item) {
            this.$confirm('此操作将永久删除该借阅记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete('/lend/' + item.id).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("删除成功")
                        this.loadData()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        }
    },
    mounted() {
    },
    created() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData()
    }
}
</script>