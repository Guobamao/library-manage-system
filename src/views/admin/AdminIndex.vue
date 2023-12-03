<template>
    <el-container style="display: flex; flex-direction: column; ">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="用户名">
                <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="管理员类型">
                <el-select v-model="searchForm.adminType" clearable placeholder="管理员类型">
                    <el-option label="普通管理员" value="0"></el-option>
                    <el-option label="高级管理员" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="adminData.records" tooltip-effect="dark" style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column label="用户名" width="300">
                <template slot-scope="scope">
                    <el-link type="primary" @click="getAdminInfo(scope.row)">{{ scope.row.username }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="管理员类型" width="500">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.adminType == 0" type="primary">普通管理员</el-tag>
                    <el-tag v-else type="danger">高级管理员</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="changePassword(scope.row)" type="text" size="small">修改密码</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="adminData.total">
            </el-pagination>
        </div>
    </el-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            searchForm: {
                id: '',
                username: '',
                adminType: ''
            },
            adminData: []
        }
    },
    methods: {
        loadData() {
            axios.get('/admin/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.adminData = res.data.data
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
        },
        getAdminInfo(row) {
            axios.get('/admin/' + row.id)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$msgbox({
                            title: '管理员信息',
                            message: '用户名：' + res.data.data.username + '<br>' +
                                '管理员类型：' + (res.data.data.adminType === 0 ? '普通管理员' : '高级管理员'),
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: '确定',
                        })
                    }
                })
        },
        search() {
            axios.get('/admin/page', {
                params: {
                    username: this.searchForm.username,
                    adminType: this.searchForm.adminType
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.adminData = res.data.data
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.loadData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        }
    },
    mounted() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData()
    }
}
</script>