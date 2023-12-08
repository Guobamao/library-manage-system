<template>
    <el-container style="display: flex; flex-direction: column;">
        <el-form :model="searchForm" size="small" :inline="true">
            <el-form-item label="借书卡号">
                <el-input v-model="searchForm.readerNumber" placeholder="借书卡号"></el-input>
            </el-form-item>
            <el-form-item label="图书名称">
                <el-input v-model="searchForm.bookName" placeholder="图书名称"></el-input>
            </el-form-item>
            <el-form-item label="借书人">
                <el-input v-model="searchForm.readerName" placeholder="借书人"></el-input>
            </el-form-item>
            <el-form-item label="图书状态">
                <el-select v-model="searchForm.status" placeholder="图书状态" clearable>
                    <el-option label="未还" value="0"></el-option>
                    <el-option label="已还" value="1"></el-option>
                    <el-option label="已逾期" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="borrowData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="图书名称" width="180">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showBookTimeline(scope.row)">
                        {{ scope.row.bookName }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="借书卡" prop="cardNumber" width="150"></el-table-column>
            <el-table-column label="借阅人" prop="readerName" width="100">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showReaderHistory(scope.row)">
                        {{ scope.row.readerName }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="借阅时间" prop="borrowTime" width="200"></el-table-column>
            <el-table-column label="还书时间" prop="actualReturnTime" width="200"></el-table-column>
            <el-table-column label="归还状态" prop="status" width="100">
                <template slot-scope="scope">
                    <el-tag :type="status[scope.row.status]">{{ status_text[scope.row.status] }}</el-tag>
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
                :total="borrowData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 图书借阅时间线对话框 -->
        <el-dialog title="借阅时间线" :visible.sync="bookDetailVisible" width="30%">
            <el-timeline :reverse="true">
                <el-timeline-item v-for="(item, index) in timelineData" :key="index" :timestamp="item.timestamp"
                    placement="top">
                    <p v-if="item.returned">
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ scope.row.bookName }}
                        </el-link>
                        已归还
                    </p>
                    <p v-else>
                        <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.readerName }}
                        </el-link>
                        借阅了
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ scope.row.bookName }}
                        </el-link>
                    </p>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

        <!-- 读者借阅历史对话框 -->
        <el-dialog title="借阅时间线" :visible.sync="readerHistoryVisible" width="30%">
            <el-timeline :reverse="true">
                <el-timeline-item v-for="(item, index) in readerHistoryData" :key="index" :timestamp="item.timestamp"
                    placement="top">
                    <p>
                        <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.readerName }}
                        </el-link>
                        借阅了
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ scope.row.bookName }}
                        </el-link>
                    </p>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </el-container>
</template>
  
<script>
import axios from 'axios';
export default {
    data() {
        return {
            searchForm: {
                cardNumber: '',
                bookName: '',
                readerName: '',
                status: ''
            },
            borrowData: [],
            status: ['warning', 'success', 'danger'],
            status_text: ['未还', '已还', '已逾期'],
            bookDetailVisible: false, // 图书借阅时间线弹窗
            readerHistoryVisible: false, // 读者借阅历史弹窗
            timelineData: [], // 时间线数据
            readerHistoryData: [], // 读者借阅历史数据
        }
    },
    methods: {
        loadData() {
            axios
                .get("/borrow/page", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.borrowData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        search() {
            axios
                .get("/borrow/page", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                        cardNumber: this.searchForm.cardNumber,
                        bookName: this.searchForm.bookName,
                        readerName: this.searchForm.readerName,
                        status: this.searchForm.status
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.borrowData = res.data.data;
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
            axios.get('/borrow/timeline', {
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
            axios.get('/borrow/history', {
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
                axios.delete('/borrow/' + item.id).then(res => {
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