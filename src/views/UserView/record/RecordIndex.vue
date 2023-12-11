<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column;">
        <el-table :data="recordList.records" tooltip-effect="dark" style="width: 100%;">
            <el-table-column label="图书名称" prop="bookName" width="200"></el-table-column>
            <el-table-column label="作者" prop="author" width="150"></el-table-column>
            <el-table-column label="图书类型" prop="categoryName" width="120"></el-table-column>
            <el-table-column label="出版社" prop="publisher" width="200"></el-table-column>
            <el-table-column label="借阅时间" prop="borrowTime" width="200"></el-table-column>
            <el-table-column label="归还时间" prop="actualReturnTime" width="200"></el-table-column>
            <el-table-column label="当前状态">
                <template slot-scope="scope">
                    <el-tag :type="statusColor[scope.row.solveStatus]">
                        {{ statusList[scope.row.solveStatus] }}
                    </el-tag>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="recordList.total">
            </el-pagination>
        </div>
    </el-container>
</template>

<script>
import { userRequest } from '@/api';
export default {
    data() {
        return {
            loading: false,
            loadingTime: 500,
            recordList: [],
            statusList: ["借阅待处理", "借阅中", "已拒绝", "归还待处理", "已归还"],
            statusColor: ['info', 'primary', 'danger', 'warning', 'success'],
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            userRequest.get("/user/book/records", {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.recordList = res.data.data;
                    setTimeout(() => {
                        this.loading = false;
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.message);
                }
            })
        }
    },
    mounted: {
    },
    created() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData();
    }
}
</script>