
import { Row } from 'element-ui';
<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="借书卡号">
                <el-input v-model="searchForm.cardNumber" placeholder="借书卡号" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="searchForm.type" placeholder="类型" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="借阅" value="0"></el-option>
                    <el-option label="归还" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="borrowData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="ID" prop="id" width="55"></el-table-column>
            <el-table-column label="姓名" prop="readerName" width="150"></el-table-column>
            <el-table-column label="图书名称" prop="bookName" width="200"></el-table-column>
            <el-table-column label="借书卡号" prop="cardNumber" width="150"></el-table-column>
            <el-table-column label="借阅时间" prop="borrowTime" width="250"></el-table-column>
            <el-table-column label="类型" width="200">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 0" type="success">借阅</el-tag>
                    <el-tag v-if="scope.row.type == 3" type="danger">归还</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="bookPass(scope.row)">通过</el-button>
                    <el-button type="danger" v-if="scope.row.type === 0" size="mini"
                        @click="bookReject(scope.row)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="borrowData.total">
            </el-pagination>
        </div>
    </el-container>
</template>

<script>
import { adminRequest } from '@/api'
export default {
    data() {
        return {
            loading: false,
            loadingTime: 500,
            searchForm: {
                cardNumber: '',
                type: '',
            },
            borrowData: []
        }
    },
    methods: {
        loadData() {
            this.loading = true,
                adminRequest.get("/pending/books", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                    }
                }).then(res => {
                    if (res.data.code === 1) {
                        this.borrowData = res.data.data
                        setTimeout(() => {
                            this.loading = false
                        }, this.loadingTime);
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        search() {
            this.loading = true
            adminRequest.get("/pending/books", {
                params: {
                    cardNumber: this.searchForm.cardNumber,
                    type: this.searchForm.type,
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.borrowData = res.data.data
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime);
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.loadData()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData();
        },
        bookPass(row) {
            if (row.type === 0) {
                adminRequest.put("/pending/books/borrow/pass", {
                    readerId: row.readerId,
                    bookId: row.bookId,
                    type: row.type,
                }).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("审核通过")
                        this.loadData()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            } else {
                adminRequest.put("/pending/books/return/pass", {
                    readerId: row.readerId,
                    bookId: row.bookId,
                    type: row.type
                }).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("审核通过，已归还")
                        this.loadData()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }
        },
        bookReject(row) {
            if (row.type === 0) {
                adminRequest.put("/pending/books/borrow/reject", {
                    readerId: row.readerId,
                    bookId: row.bookId,
                    type: row.type,
                }).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("已驳回")
                        this.loadData()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            } else {
                this.$message.error("归还不可驳回")
            }
        }
    },
    created() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData()
    },
}
</script>