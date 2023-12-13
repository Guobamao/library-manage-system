<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item label="类型名称">
                <el-input v-model="searchForm.name" placeholder="类型名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick" size="small">新增类型</el-button>
        </el-form>
        <el-table ref="multipleTable" :data="categoryData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column label="类型名称" prop="name" width="200"></el-table-column>
            <el-table-column label="备注" prop="description" width="500" show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteById(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
                :total="categoryData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 新增类型对话框 -->
        <el-dialog title="新增类型" :visible.sync="addFormVisible" width="30rem">
            <el-form :model="addForm">
                <el-form-item label="类型名称" label-width="20%" required>
                    <el-input v-model="addForm.name" autocomplete="off" placeholder="请输入类型名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="20%" required>
                    <el-input type="textarea" v-model="addForm.description" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addCategory" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑类型对话框 -->

        <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm">
                <el-form-item label="类型名称" label-width="20%" required>
                    <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入类型名称"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="20%" required>
                    <el-input type="textarea" v-model="editForm.description" :rows="3"></el-input>
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
                name: "",
            },
            categoryData: [],
            addFormVisible: false,
            addForm: {
                name: "",
                description: "",
            },
            editFormVisible: false,
            editForm: {
                id: "",
                name: "",
                description: "",
            },
            loading: true,
            loadingTime: 500
        };
    },
    methods: {
        loadData() {
            this.loading = true
            adminRequest.get("/categories", {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.categoryData = res.data.data;
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        search() {
            this.loading = true
            adminRequest.get("/categories", {
                params: {
                    name: this.searchForm.name,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.categoryData = res.data.data;
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.loadData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.loadData();
        },
        handleSubmitClick() {
            this.addForm = {
                name: "",
                description: "",
            };
            this.addFormVisible = true;
        },
        addCategory() {
            adminRequest.post("/categories", this.addForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("新增类型成功");
                        this.loadData();
                        this.addFormVisible = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        deleteById(row) {
            this.$confirm("确认删除该类型吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                adminRequest.delete("/categories/" + row.id)
                    .then((res) => {
                        if (res.data.code === 1) {
                            this.$message.success("删除成功");
                            this.loadData();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
            }).catch(() => { })
        },
        showEdit(row) {
            this.editFormVisible = true;
            this.editForm = row;
        },
        submitInfo(categoryId) {
            adminRequest.put("/categories/" + categoryId, this.editForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("修改成功");
                        this.loadData();
                        this.editFormVisible = false;
                    } else {
                        this.$message.error(res.data.msg);
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
};
</script>