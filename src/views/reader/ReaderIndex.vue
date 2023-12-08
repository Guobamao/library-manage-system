<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column; ">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="借书卡号">
                <el-input v-model="searchForm.cardNumber" placeholder="借书卡号"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="searchForm.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="searchForm.phone" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="readerData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="借书卡号" prop="cardNumber" width="130">
                <template slot-scope="scope">
                    {{ scope.row.cardNumber ? scope.row.cardNumber : '暂无' }}
                </template>
            </el-table-column>
            <el-table-column label="姓名" width="120">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="getReaderInfo(scope.row)">{{ scope.row.name
                    }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="性别" width="70">
                <template slot-scope="scope">
                    {{ scope.row.gender === 0 ? '男' : '女' }}
                </template>
            </el-table-column>
            <el-table-column label="联系方式" prop="phone" width="150"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="200">
                <template slot-scope="scope">
                    {{ scope.row.email ? scope.row.email : '无' }}
                </template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createTime" width="200"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" plain @click="deleteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="readerData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 读者编辑对话框 -->
        <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm">
                <el-form-item label="借书卡号" label-width="20%">
                    <el-input v-model="editForm.cardNumber" autocomplete="off" placeholder="请输入借书卡号"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="20%" required>
                    <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="20%" required>
                    <el-select v-model="editForm.gender" placeholder="请选择性别" style="width: calc(30rem - 34%);">
                        <el-option label="男" value=0></el-option>
                        <el-option label="女" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系方式" label-width="20%" required>
                    <el-input v-model="editForm.phone" autocomplete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="20%" required>
                    <el-input v-model="editForm.email" autocomplete="off" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
                <el-form-item label="地址" label-width="20%" required>
                    <el-input v-model="editForm.address" autocomplete="off" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="生日" label-width="20%" required>
                    <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                        style="width: calc(30rem - 36%);"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitInfo">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            searchForm: {
                name: '',
                phone: '',
                cardNumber: ''
            },
            readerData: [],
            addFormVisible: false,
            addForm: {
                name: '',
                password: '',
                gender: '',
                birthday: '',
                address: '',
                phone: '',
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                password: '',
                gender: '',
                birthday: '',
                address: '',
                phone: '',
                email: '',
                cardNumber: '',
            },
            loading: true,
            loadingTime: 500
        }
    },
    methods: {
        loadData() {
            this.loading = true
            axios.get('/reader/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.readerData = res.data.data
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        search() {
            this.loading = true
            axios.get('/reader/page', {
                params: {
                    name: this.searchForm.name,
                    phone: this.searchForm.phone,
                    cardNumber: this.searchForm.cardNumber,
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.readerData = res.data.data
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
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
            this.currentPage = val
            this.loadData()
        },
        showEdit(row) {
            this.editFormVisible = true
            this.editForm = row
        },
        submitInfo() {
            axios.put('/reader', this.editForm)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("修改成功")
                        this.loadData()
                        this.editFormVisible = false
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        deleteById(row) {
            this.$confirm('确认删除该读者吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete('/reader/' + row.id)
                    .then(res => {
                        if (res.data.code === 1) {
                            this.$message.success('删除成功')
                            this.loadData()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
            }).catch(() => { })
        },
        getReaderInfo(row) {
            axios.get('/reader/' + row.id)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$msgbox({
                            title: '读者信息',
                            message: '姓名：' + res.data.data.name + '<br>' +
                                '性别：' + res.data.data.gender + '<br>' +
                                '生日：' + res.data.data.birthday + '<br>' +
                                '联系方式：' + res.data.data.phone + '<br>' +
                                '邮箱：' + res.data.data.email + '<br>' +
                                '地址：' + res.data.data.address + '<br>' +
                                '借书卡号：' + res.data.data.cardNumber + '<br>' +
                                '注册时间：' + res.data.data.createTime + '<br>'
                            ,
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: '确定',
                        }).catch(() => { })
                    }
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