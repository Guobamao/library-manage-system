<template>
    <el-container style="display: flex; flex-direction: column; ">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="借书卡号">
                <el-input v-model="searchForm.readerNumber" placeholder="借书卡号"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="searchForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="searchForm.tel" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick">添加</el-button>
        </el-form>
        <el-dialog title="添加读者" :visible.sync="addFormVisible" width="600px">
            <el-form :model="addForm">
                <el-form-item label="用户名" label-width="15%" required>
                    <el-input v-model="addForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="15%" required>
                    <el-input v-model="addForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" label-width="15%" required>
                    <el-input v-model="addForm.realName" autocomplete="off" placeholder="请输入真实姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" label-width="15%" required>
                    <el-select v-model="addForm.sex" placeholder="请选择性别" style="width: calc(600px - 26%);">
                        <el-option label="男" value=0></el-option>
                        <el-option label="女" value=1></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生日" label-width="15%" required>
                    <el-date-picker v-model="addForm.birthday" type="date" placeholder="选择日期"
                        value-format="yyyy-MM-dd"
                        style="width: calc(600px - 26%);">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="地址" label-width="15%" required>
                    <el-input v-model="addForm.address" autocomplete="off" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" label-width="15%" required>
                    <el-input v-model="addForm.tel" autocomplete="off" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="15%" required>
                    <el-input v-model="addForm.email" autocomplete="off" placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" size="small" @click="addReader">确 定</el-button>
            </div>
        </el-dialog>
        <el-table ref="multipleTable" :data="readerData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="借书卡号" prop="readerNumber" width="130"></el-table-column>
            <el-table-column label="用户名" prop="username" width="120"></el-table-column>
            <el-table-column label="真实姓名" prop="realName" width="100"></el-table-column>
            <el-table-column label="性别" prop="sex" width="70"></el-table-column>
            <el-table-column label="联系方式" prop="tel" width="150"></el-table-column>
            <el-table-column label="注册时间" prop="registerDate" width="200"></el-table-column>
            <el-table-column label="邮箱" prop="email" width="200"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" plain @click="deleteById(scope.row)">删除</el-button>
                    <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="600px">
                        <el-form :model="editForm">
                            <el-form-item label="借书卡号" label-width="20%" required>
                                <el-input v-model="editForm.readerNumber" autocomplete="off" placeholder="请输入借书卡号"></el-input>
                            </el-form-item>
                            <el-form-item label="用户名" label-width="20%" required>
                                <el-input v-model="editForm.username" autocomplete="off" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                            <el-form-item label="真实姓名" label-width="20%" required>
                                <el-input v-model="editForm.realName" autocomplete="off" placeholder="请输入真实姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" label-width="20%" required>
                                <el-select v-model="editForm.sex" placeholder="请选择性别" style="width: calc(600px - 34%);">
                                    <el-option label="男" value=0></el-option>
                                    <el-option label="女" value=1></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系方式" label-width="20%" required>
                                <el-input v-model="editForm.tel" autocomplete="off" placeholder="请输入联系方式"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" label-width="20%" required>
                                <el-input v-model="editForm.email" autocomplete="off" placeholder="请输入电子邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="地址" label-width="20%" required>
                                <el-input v-model="editForm.address" autocomplete="off" placeholder="请输入地址"></el-input>
                            </el-form-item>
                            <el-form-item label="生日" label-width="20%" required>
                                <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期"
                                    value-format="yyyy-MM-dd"
                                    style="width: calc(600px - 34%);">
                                </el-date-picker>
                            </el-form-item>
                            <!-- 注册时间 -->
                            <el-form-item label="注册时间" label-width="20%" required>
                                <el-date-picker v-model="editForm.registerDate" type="datetime" placeholder="选择时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                    style="width: calc(600px - 34%);">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="editFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitInfo">确 定</el-button>
                        </div>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="readerData.total">
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
                username: '',
                tel: '',
                readerNumber: ''
            },
            readerData: [],
            addFormVisible: false,
            addForm: {
                username: '',
                password: '',
                realName: '',
                sex: '',
                birthday: '',
                address: '',
                tel: '',
                email: '',
            },
            editFormVisible: false,
            editForm: {
                id: '',
                username: '',
                password: '',
                realName: '',
                sex: '',
                birthday: '',
                address: '',
                tel: '',
                email: '',
                registerDate: '',
                readerNumber: ''
            },
        }
    },
    methods: {
        loadData() {
            axios.get('/reader/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
            })
                .then(res => {
                    if (res.data.code === 1) {
                        this.readerData = res.data.data
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
        },
        search() {
            axios.get('/reader/page', {
                params: {
                    username: this.searchForm.username,
                    tel: this.searchForm.tel,
                    readerNumber: this.searchForm.readerNumber,
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.readerData = res.data.data
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
            this.addForm.username = ''
            this.addForm.password = ''
            this.addForm.realName = ''
            this.addForm.address = ''
            this.addForm.tel = ''
            this.addForm.email = ''
            this.addForm.readerNumber = ''
            this.addForm.birthday = ''
            this.addFormVisible = true
        },
        addReader() {
            axios.post('/reader', this.addForm)
                .then(res => {
                    if (res.data.code === 1) {
                        this.$message.success(res.data.msg)
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
            })
                .then(() => {
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