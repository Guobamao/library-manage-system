<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column;">
        <el-form :inline="true" :model="searchForm"  size="small">
            <el-form-item label="用户名">
                <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="管理员类型">
                <el-select v-model="searchForm.adminType" clearable placeholder="管理员类型">
                    <el-option label="普通管理员" value="0"></el-option>
                    <el-option label="超级管理员" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick"  size="small">添加</el-button>
        </el-form>
        <el-table ref="multipleTable" :data="adminData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="用户名" width="150">
                <template slot-scope="scope">
                    <el-link type="primary" @click="getAdminInfo(scope.row)">{{ scope.row.username }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="150"></el-table-column>
            <el-table-column prop="phone" label="联系方式" width="150"></el-table-column>
            <el-table-column prop="email" label="电子邮箱" width="250"></el-table-column>
            <el-table-column label="管理员类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.adminType == 0" type="primary">普通管理员</el-tag>
                    <el-tag v-else type="danger">高级管理员</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="adminData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 添加管理员对话框 -->
        <el-dialog title="添加管理员" :visible.sync="addFormVisible" width="30rem">
            <el-form :model="addForm">
                <el-form-item label="用户名" label-width="25%" required>
                    <el-input v-model="addForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="25%" required>
                    <el-input v-model="addForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="25%" required>
                    <el-input v-model="addForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" label-width="25%" required>
                    <el-input v-model="addForm.phone" autocomplete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="管理员类型" label-width="25%" required>
                    <el-select v-model="addForm.adminType" placeholder="请选择管理员类型" style="width: calc(30rem - 45%);">
                        <el-option label="普通管理员" value=0></el-option>
                        <el-option label="高级管理员" value=1></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addAdmin" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑管理员对话框 -->
        <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm">
                <el-form-item label="用户名" label-width="6rem" required>
                    <el-input v-model="editForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="6rem">
                    <el-input v-model="editForm.password" autocomplete="off" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="姓名" label-width="6rem" required>
                    <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" label-width="6rem" required>
                    <el-input v-model="editForm.phone" autocomplete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" label-width="6rem">
                    <el-input v-model="editForm.email" autocomplete="off" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
                <el-form-item label="管理员类型" label-width="6rem" required>
                    <el-select v-model="editForm.adminType" placeholder="请选择管理员类型" style="width: 21.5rem;">
                        <el-option label="普通管理员" value=0></el-option>
                        <el-option label="高级管理员" value=1></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitInfo(editForm.id)" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import { adminRequest } from '@/api';
export default {
    data() {
        return {
            searchForm: {
                id: '',
                username: '',
                adminType: ''
            },
            adminData: [],
            addFormVisible: false,
            addForm: {
                username: '',
                password: '',
                name: '',
                phone: '',
                adminType: ''
            },
            editFormVisible: false,
            editForm: {
                id: '',
                username: '',
                password: '',
                name: '',
                phone: '',
                email: '',
                adminType: ''
            },
            loading: true,
            loadingTime: 500
        }
    },
    methods: {
        loadData() {
            this.loading = true
            adminRequest.get('/admins', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.adminData = res.data.data
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getAdminInfo(row) {
            adminRequest.get('/admins/' + row.id)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$msgbox({
                            title: '管理员信息',
                            message: '用户名：' + res.data.data.username + '<br>' +
                                '姓名：' + res.data.data.name + '<br>' +
                                '联系方式：' + res.data.data.phone + '<br>' +
                                '电子邮箱：' + res.data.data.email + '<br>' +
                                '创建时间：' + res.data.data.createTime + '<br>' +
                                '修改时间：' + res.data.data.updateTime + '<br>' +
                                '修改人：' + res.data.data.updateUser + '<br>' +
                                '管理员类型：' + (res.data.data.adminType === 0 ? '普通管理员' : '高级管理员'),
                            dangerouslyUseHTMLString: true,
                            confirmButtonText: '确定',
                        }).catch(() => { })
                    }
                })
        },
        search() {
            this.loading = true
            adminRequest.get('/admins', {
                params: {
                    username: this.searchForm.username,
                    adminType: this.searchForm.adminType
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.adminData = res.data.data
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
        handleSubmitClick() {
            this.addForm = {
                username: '',
                password: '',
                name: '',
                phone: '',
                adminType: ''
            }
            this.addFormVisible = true
        },
        deleteById(row) {
            this.$confirm('确认删除该管理员吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                adminRequest.delete('/admins/' + row.id)
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
        addAdmin() {
            adminRequest.post('/admins', this.addForm).then(res => {
                if (res.data.code === 1) {
                    this.$message.success('添加成功')
                    this.loadData()
                    this.addFormVisible = false
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        showEdit(row) {
            this.editFormVisible = true
            this.editForm = row
            this.editForm.password = ''
            this.editForm.adminType = row.adminType.toString()
        },
        submitInfo(adminId) {
            adminRequest.put('/admins/' + adminId, this.editForm).then(res => {
                if (res.data.code === 1) {
                    this.$message.success('修改成功')
                    this.loadData()
                    this.editFormVisible = false
                } else {
                    this.$message.error(res.data.msg)
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