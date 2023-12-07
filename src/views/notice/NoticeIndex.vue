<template>
    <el-container style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="公告主题">
                <el-input v-model="searchForm.title" placeholder="公告主题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick">发布公告</el-button>
        </el-form>
        <el-dialog title="发布公告" :visible.sync="addFormVisible" width="600px">
            <el-form :model="addForm">
                <el-form-item label="公告主题" label-width="15%" required>
                    <el-input v-model="addForm.title" autocomplete="off" placeholder="请输入公告主题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" label-width="15%" required>
                    <el-input type="textarea" v-model="addForm.content"></el-input>
                </el-form-item>
                <el-form-item label="过期时间" label-width="15%" required>
                    <el-date-picker v-model="addForm.expireTime" type="datetime" placeholder="选择日期时间"
                        default-time="12:00:00" value-format="yyyy-MM-dd HH:mm:ss" style="width: calc(600px - 26%);">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addNotice" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-table ref="multipleTable" :data="noticeData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="公告主题" width="150" show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showInfo(scope.row)">{{ scope.row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="公告内容" prop="content" width="250" show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="发布者" prop="createUserName" width="100"></el-table-column>
            <el-table-column label="发布时间" prop="createTime" width="200"></el-table-column>
            <el-table-column label="过期时间" prop="expireTime" width="200"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteById(scope.row)">删除</el-button>
                    <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="600px">
                        <el-form :model="editForm">
                            <el-form-item label="公告标题" label-width="20%" required>
                                <el-input v-model="editForm.title" autocomplete="off" placeholder="请输入公告标题"></el-input>
                            </el-form-item>
                            <el-form-item label="公告内容" label-width="20%" required>
                                <el-input type="textarea" v-model="editForm.content"></el-input>
                            </el-form-item>
                            <el-form-item label="过期时间" label-width="20%" required>
                                <el-date-picker v-model="editForm.expireTime" type="datetime" placeholder="选择日期时间"
                                    default-time="12:00:00" value-format="yyyy-MM-dd HH:mm:ss"
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
                :total="noticeData.total">
            </el-pagination>
        </div>
    </el-container>
</template>

<script>
import axios from "axios";
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
        };
    },
    methods: {
        loadData() {
            axios
                .get("/notice/page", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.noticeData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
        },
        search() {
            axios
                .get("/notice/page", {
                    params: {
                        title: this.searchForm.title,
                    },
                })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.noticeData = res.data.data;
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
            axios.post("/notice", this.addForm)
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
            })
                .then(() => {
                    axios.delete("/notice/" + row.id)
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
        submitInfo() {
            axios.put("/notice", this.editForm)
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
