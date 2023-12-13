<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item label="公告主题">
                <el-input v-model="searchForm.title" placeholder="公告主题" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick" size="small">发布公告</el-button>
        </el-form>
        <el-table ref="multipleTable" :data="noticeData.records" tooltip-effect="dark"
            :default-sort="{ prop: 'createTime', order: 'descending' }" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
            <el-table-column label="公告主题" width="150" show-overflow-tooltip="true" sortable>
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showInfo(scope.row)">{{ scope.row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="公告内容" prop="content" width="250" show-overflow-tooltip="true" sortable></el-table-column>
            <el-table-column label="发布者" prop="createUserName" width="100" sortable></el-table-column>
            <el-table-column label="发布时间" prop="createTime" width="200" sortable></el-table-column>
            <el-table-column label="过期时间" prop="expireTime" width="200" sortable></el-table-column>
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
                :total="noticeData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 发布公告对话框 -->
        <el-dialog title="发布公告" :visible.sync="addFormVisible" width="30rem">
            <el-form :model="addForm">
                <el-form-item label="公告主题" label-width="20%" required>
                    <el-input v-model="addForm.title" autocomplete="off" placeholder="请输入公告主题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" label-width="20%" required>
                    <el-input type="textarea" v-model="addForm.content" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="过期时间" label-width="20%" required>
                    <el-date-picker v-model="addForm.expireTime" type="datetime" placeholder="选择日期时间"
                        default-time="12:00:00" value-format="yyyy-MM-dd HH:mm:ss" style="width: calc(30rem - 36%);">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addNotice" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑公告对话框 -->
        <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm">
                <el-form-item label="公告标题" label-width="20%" required>
                    <el-input v-model="editForm.title" autocomplete="off" placeholder="请输入公告标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" label-width="20%" required>
                    <el-input type="textarea" v-model="editForm.content" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="过期时间" label-width="20%" required>
                    <el-date-picker v-model="editForm.expireTime" type="datetime" placeholder="选择日期时间"
                        default-time="12:00:00" value-format="yyyy-MM-dd HH:mm:ss" style="width: calc(30rem - 36%);">
                    </el-date-picker>
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
                title: "",
            },
            noticeData: [],
            addFormVisible: false,
            addForm: {
                title: "",
                content: "",
                expireTime: "",
            },
            editFormVisible: false,
            editForm: {
                title: "",
                content: "",
                createTime: "",
                expireTime: ""
            },
            loading: true,
            loadingTime: 500
        };
    },
    methods: {
        loadData() {
            this.loading = true
            adminRequest.get("/notices", {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.noticeData = res.data.data;
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
            adminRequest.get("/notices", {
                params: {
                    title: this.searchForm.title,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.noticeData = res.data.data;
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
            this.addForm.title = "";
            this.addForm.content = "";
            this.addFormVisible = true;
        },
        addNotice() {
            adminRequest.post("/notices", this.addForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("发布成功");
                        this.loadData();
                        this.addFormVisible = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        deleteById(row) {
            this.$confirm("确认删除该公告吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                adminRequest.delete("/notices/" + row.id)
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
        submitInfo(noticeId) {
            adminRequest.put("/notices/" + noticeId, this.editForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("修改成功");
                        this.loadData();
                        this.editFormVisible = false;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        showInfo(row) {
            this.$alert(row.content, "公告内容", {
                confirmButtonText: "确定",
                dangerouslyUseHTMLString: true,
                callback: () => { },
            });
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
