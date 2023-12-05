<template>
    <el-container style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="图书编号">
                <el-input v-model="searchForm.isbn" placeholder="图书编号"></el-input>
            </el-form-item>
            <el-form-item label="书名">
                <el-input v-model="searchForm.name" placeholder="书名"></el-input>
            </el-form-item>
            <el-form-item label="图书分类">
                <el-select v-model="searchForm.typeId" placeholder="图书分类" clearable>
                    <el-option v-for="item in typeData.records" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick">添加图书</el-button>
        </el-form>
        <el-dialog title="添加图书" :visible.sync="addFormVisible" width="600px">
            <el-form :model="addForm">
                <el-form-item label="图书名称" label-width="15%" required>
                    <el-input v-model="addForm.name" autocomplete="off" placeholder="请输入图书名称"></el-input>
                </el-form-item>
                <el-form-item label="作者" label-width="15%" required>
                    <el-input v-model="addForm.author" autocomplete="off" placeholder="请输入作者"></el-input>
                </el-form-item>
                <el-form-item label="出版社" label-width="15%" required>
                    <el-input v-model="addForm.publish" autocomplete="off" placeholder="请输入出版社"></el-input>
                </el-form-item>
                <el-form-item label="ISBN" label-width="15%" required>
                    <el-input v-model="addForm.isbn" autocomplete="off" placeholder="请输入ISBN"></el-input>
                </el-form-item>
                <el-form-item label="语言" label-width="15%" required>
                    <el-input v-model="addForm.language" autocomplete="off" placeholder="请输入语言"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="15%" required>
                    <el-input v-model="addForm.price" autocomplete="off" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="出版日期" label-width="15%" required>
                    <el-date-picker v-model="addForm.publishDate" type="date" placeholder="选择日期" style="width: calc(600px - 26%);"></el-date-picker>
                </el-form-item>
                <el-form-item label="图书分类" label-width="15%" required>
                    <el-select v-model="addForm.typeId" placeholder="图书分类" style="width: calc(600px - 26%);">
                        <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" label-width="15%" required>
                    <el-select v-model="addForm.status" placeholder="状态" style="width: calc(600px - 26%);">
                        <el-option label="在馆" value="0"></el-option>
                        <el-option label="借出" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="简介" label-width="15%" required>
                    <el-input type="textarea" v-model="addForm.introduction"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addBook" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-table ref="multipleTable" :data="bookData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="图书编号" prop="isbn" width="100"></el-table-column>
            <el-table-column label="图书名称" prop="name" width="180"></el-table-column>
            <el-table-column label="作者" prop="author" width="100"></el-table-column>
            <el-table-column label="图书类型" prop="type" width="100">
            </el-table-column>
            <el-table-column label="出版社" prop="publish" width="150"></el-table-column>
            <el-table-column label="价格" prop="price" width="80"></el-table-column>
            <el-table-column label="语言" prop="language"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="showEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteById(scope.row)">删除</el-button>
                    <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="600px">
                        <el-form :model="editForm">
                            <el-form-item label="图书名称" label-width="20%" required>
                                <el-input v-model="editForm.name" autocomplete="off" placeholder="请输入图书名称"></el-input>
                            </el-form-item>
                            <el-form-item label="作者" label-width="20%" required>
                                <el-input v-model="editForm.author" autocomplete="off" placeholder="请输入作者"></el-input>
                            </el-form-item>
                            <el-form-item label="出版社" label-width="20%" required>
                                <el-input v-model="editForm.publish" autocomplete="off" placeholder="请输入出版社"></el-input>
                            </el-form-item>
                            <el-form-item label="ISBN" label-width="20%" required>
                                <el-input v-model="editForm.isbn" autocomplete="off" placeholder="请输入ISBN"></el-input>
                            </el-form-item>
                            <el-form-item label="简介" label-width="20%" required>
                                <el-input type="textarea" v-model="editForm.introduction"></el-input>
                            </el-form-item>
                            <el-form-item label="语言" label-width="20%" required>
                                <el-input v-model="editForm.language" autocomplete="off" placeholder="请输入语言"></el-input>
                            </el-form-item>
                            <el-form-item label="价格" label-width="20%" required>
                                <el-input v-model="editForm.price" autocomplete="off" placeholder="请输入价格"></el-input>
                            </el-form-item>
                            <el-form-item label="出版日期" label-width="20%" required>
                                <el-date-picker v-model="editForm.publishDate" type="date" placeholder="选择日期"></el-date-picker>
                            </el-form-item>
                            <el-form-item label="图书分类" label-width="20%" required>
                                <el-select v-model="editForm.typeId" placeholder="图书分类">
                                    <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态" label-width="20%" required>
                                <el-select v-model="editForm.status" placeholder="状态">
                                    <el-option label="在馆" value="0"></el-option>
                                    <el-option label="借出" value="1"></el-option>
                                </el-select>
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
                :total="bookData.total">
            </el-pagination>
        </div>
    </el-container>
</template>
  
<script>
import axios from 'axios'
export default {
    data() {
        return {
            bookData: [],
            typeData: [],
            searchForm: {
                isbn: '',
                name: '',
                typeId: '',
            },
            addFormVisible: false,
            addForm: {
                name: '',
                author: '',
                publish: '',
                isbn: '',
                introduction: '',
                language: '',
                price: '',
                publishDate: '',
                typeId: '',
                status: '',
            },
            editFormVisible: false,
            editForm: {
                id: '',
                name: '',
                author: '',
                publish: '',
                isbn: '',
                introduction: '',
                language: '',
                price: '',
                publishDate: '',
                typeId: '',
                status: '',
            },
        }
    },
    methods: {
        loadData() {
            axios.get('/book/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            })
                .then((res) => {
                    if (res.data.code === 1) {
                        this.bookData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            axios.get('/type/page')
                .then((res) => {
                    if (res.data.code === 1) {
                        this.typeData = res.data.data;
                    } else {
                        this.$message.error(res.data.msg);
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
            this.addFormVisible = true;
        },
        search() {
            axios.get('/book/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    isbn: this.searchForm.isbn,
                    name: this.searchForm.name,
                    typeId: this.searchForm.typeId,
                }
            }).then((res) => {
                if (res.data.code === 1) {
                    this.bookData = res.data.data;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        addBook() {
            axios.post('/book', this.addForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("添加成功");
                        this.addFormVisible = false;
                        this.loadData();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        showEdit(row) {
            console.log(row);
            this.editFormVisible = true;
            this.editForm = row;
        },
        submitInfo() {
            axios.put('/book', this.editForm)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.$message.success("修改成功");
                        this.editFormVisible = false;
                        this.loadData();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        deleteById(row) {
            this.$confirm('此操作将永久删除该图书, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                axios.delete('/book/' + row.id)
                    .then((res) => {
                        if (res.data.code === 1) {
                            this.$message.success("删除成功");
                            this.loadData();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
            }).catch(() => {});
        },
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
