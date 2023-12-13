
import { Row } from 'element-ui';
<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item label="读者姓名">
                <el-input v-model="searchForm.readerName" placeholder="读者姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="searchForm.type" placeholder="类型" clearable>
                    <el-option label="全部" value=""></el-option>
                    <el-option label="正常申请" value="0"></el-option>
                    <el-option label="挂失申请" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="cardsData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="ID" prop="id" width="55"></el-table-column>
            <el-table-column label="姓名" prop="readerName" width="150"></el-table-column>
            <el-table-column label="申请实际" prop="applyTime" width="250"></el-table-column>
            <el-table-column label="类型" width="200">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 0" type="success">正常申请</el-tag>
                    <el-tag v-if="scope.row.type == 1" type="danger">挂失申请</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="cardPass(scope.row)">通过</el-button>
                    <el-button type="danger" size="mini" @click="cardReject(scope.row)">驳回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="cardsData.total">
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
                readerName: '',
                type: '',
            },
            cardsData: []
        }
    },
    methods: {
        loadData() {
            this.loading = true,
                adminRequest.get("/pending/cards", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                    }
                }).then(res => {
                    if (res.data.code === 1) {
                        this.cardsData = res.data.data
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
            adminRequest.get("/pending/cards", {
                params: {
                    readerName: this.searchForm.readerName,
                    type: this.searchForm.type,
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.cardsData = res.data.data
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
        cardPass(row) {
            adminRequest.put("/pending/cards/" + row.readerId + "/pass", {
                type: row.type,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("审核通过")
                    this.loadData()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        cardReject(row) {
            adminRequest.put("/pending/cards/" + row.readerId + "/reject", {
                type: row.type,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("已驳回")
                    this.loadData()
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    },
    created() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData()
    },
}
</script>