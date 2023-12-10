<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column">
        <el-form :inline="true" :model="searchForm">
            <el-form-item label="图书编号">
                <el-input v-model="searchForm.isbn" placeholder="图书编号"></el-input>
            </el-form-item>
            <el-form-item label="书名">
                <el-input v-model="searchForm.title" placeholder="书名"></el-input>
            </el-form-item>
            <el-form-item label="图书分类">
                <el-select v-model="searchForm.categoryId" placeholder="图书分类" clearable>
                    <el-option v-for="item in categoryData.records" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
            <el-button type="primary" @click="handleSubmitClick">添加图书</el-button>
        </el-form>

        <el-table ref="multipleTable" :data="bookData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="封面" prop="cover" width="120">
                <template slot-scope="scope">
                    <img :src="scope.row.cover" alt="" style="width: 80px;">
                </template>
            </el-table-column>
            <el-table-column label="图书编号" prop="isbn" width="150"></el-table-column>
            <el-table-column label="图书名称" prop="title" width="150">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="getBookInfo(scope.row)">
                        {{ scope.row.title }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="作者" prop="author" width="150"></el-table-column>
            <el-table-column label="图书类型" prop="categoryName" width="100"></el-table-column>
            <el-table-column label="出版社" prop="publisher" width="150"></el-table-column>
            <el-table-column label="价格" prop="price" width="80"></el-table-column>
            <el-table-column label="语言" prop="language" width="80"></el-table-column>
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
                :total="bookData.total">
            </el-pagination>
        </div>


        <!-- 页面对话框 -->
        <!-- 添加图书对话框 -->
        <el-dialog title="添加图书" :visible.sync="addFormVisible" width="30rem">
            <el-form :model="addForm">
                <el-form-item label="图书名称" label-width="20%" required>
                    <el-input v-model="addForm.title" autocomplete="off" placeholder="请输入图书名称"></el-input>
                </el-form-item>
                <el-form-item label="作者" label-width="20%" required>
                    <el-input v-model="addForm.author" autocomplete="off" placeholder="请输入作者"></el-input>
                </el-form-item>
                <el-form-item label="出版社" label-width="20%" required>
                    <el-input v-model="addForm.publisher" autocomplete="off" placeholder="请输入出版社"></el-input>
                </el-form-item>
                <el-form-item label="ISBN" label-width="20%" required>
                    <el-input v-model="addForm.isbn" autocomplete="off" placeholder="请输入ISBN"></el-input>
                </el-form-item>
                <el-form-item label="出版日期" label-width="20%" required>
                    <el-date-picker v-model="addForm.publishDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                        style="width: calc(30rem - 36%);"></el-date-picker>
                </el-form-item>
                <el-form-item label="简介" label-width="20%" required>
                    <el-input type="textarea" v-model="addForm.description"></el-input>
                </el-form-item>
                <el-form-item label="封面" label-width="20%" required>
                    <el-input v-model="addForm.cover" autocomplete="off" placeholder="请输入封面URL"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="20%" required>
                    <el-input v-model="addForm.price" autocomplete="off" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="数量" label-width="20%" required>
                    <el-input v-model="addForm.quantity" autocomplete="off" placeholder="请输入图书数量"></el-input>
                </el-form-item>
                <el-form-item label="语言" label-width="20%" required>
                    <el-input v-model="addForm.language" autocomplete="off" placeholder="请输入语言"></el-input>
                </el-form-item>
                <el-form-item label="图书分类" label-width="20%" required>
                    <el-select v-model="addForm.categoryId" placeholder="图书分类" style="width: calc(30rem - 36%);">
                        <el-option v-for="item in categoryData.records" :key="item.id" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="addBook" size="small">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 显示图书信息对话框 -->
        <el-dialog title="图书信息" :visible.sync="bookInfoVisible">
            <el-descriptions :column="2" border>
                <el-descriptions-item>
                    <template slot="label">图书封面</template>
                    <img :src="bookInfo.cover" alt="" style="width: 100px;">
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">图书名称</template>
                    {{ bookInfo.title }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">作者</template>
                    {{ bookInfo.author }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">ISBN</template>
                    {{ bookInfo.isbn }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">出版社</template>
                    {{ bookInfo.publisher }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">出版时间</template>
                    {{ bookInfo.publishDate }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">分类</template>
                    {{ bookInfo.categoryName }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">价格</template>
                    ￥{{ bookInfo.price }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">数量</template>
                    {{ bookInfo.quantity }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">语言</template>
                    {{ bookInfo.language }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">创建时间</template>
                    {{ bookInfo.createTime }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">更新时间</template>
                    {{ bookInfo.updateTime }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">简介</template>
                    {{ bookInfo.description }}
                </el-descriptions-item>
            </el-descriptions>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="bookInfoVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑图书对话框 -->
        <el-dialog title="编辑信息" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm">
                <el-form-item label="图书名称" label-width="20%" required>
                    <el-input v-model="editForm.title" autocomplete="off" placeholder="请输入图书名称"></el-input>
                </el-form-item>
                <el-form-item label="作者" label-width="20%" required>
                    <el-input v-model="editForm.author" autocomplete="off" placeholder="请输入作者"></el-input>
                </el-form-item>
                <el-form-item label="出版社" label-width="20%" required>
                    <el-input v-model="editForm.publisher" autocomplete="off" placeholder="请输入出版社"></el-input>
                </el-form-item>
                <el-form-item label="出版日期" label-width="20%" required>
                    <el-date-picker v-model="editForm.publishDate" type="date" placeholder="选择日期"
                        style="width: calc(30rem - 36%);"></el-date-picker>
                </el-form-item>
                <el-form-item label="ISBN" label-width="20%" required>
                    <el-input v-model="editForm.isbn" autocomplete="off" placeholder="请输入ISBN"></el-input>
                </el-form-item>
                <el-form-item label="简介" label-width="20%" required>
                    <el-input type="textarea" v-model="editForm.description" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="封面" label-width="20%" required>
                    <el-input v-model="editForm.cover" autocomplete="off" placeholder="请输入封面URL"></el-input>
                </el-form-item>
                <el-form-item label="价格" label-width="20%" required>
                    <el-input v-model="editForm.price" autocomplete="off" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="数量" label-width="20%" required>
                    <el-input v-model="editForm.quantity" autocomplete="off" placeholder="请输入图书数量"></el-input>
                </el-form-item>
                <el-form-item label="语言" label-width="20%" required>
                    <el-input v-model="editForm.language" autocomplete="off" placeholder="请输入语言"></el-input>
                </el-form-item>
                <el-form-item label="图书分类" label-width="20%" required>
                    <el-select v-model="editForm.categoryId" placeholder="图书分类" style="width: calc(30rem - 36%);">
                        <el-option v-for="item in categoryData.records" :key="item.id" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
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
import { adminRequest } from '@/api';
export default {
    data() {
        return {
            bookData: [], // 图书数据
            categoryData: [], // 图书分类数据
            searchForm: { // 搜索表单
                isbn: '',
                title: '',
                categoryId: '',
            },
            addFormVisible: false,
            addForm: { // 添加图书表单
                title: '',
                author: '',
                publisher: '',
                publishDate: '',
                isbn: '',
                description: '',
                cover: '',
                price: '',
                quantity: '',
                categoryId: '',
                language: ''
            },
            editFormVisible: false,
            editForm: { // 编辑图书表单
                id: '',
                title: '',
                author: '',
                publisher: '',
                publishDate: '',
                isbn: '',
                description: '',
                cover: '',
                price: '',
                quantity: '',
                categoryId: '',
                language: '',
            },
            bookInfoVisible: false,
            bookInfo: [],
            loading: true,
            loadingTime: 500
        }
    },
    methods: {
        loadData() {
            this.loading = true
            adminRequest.get('/book/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.bookData = res.data.data;
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg);
                }
            });
            adminRequest.get('/category/page')
                .then((res) => {
                    if (res.data.code === 1) {
                        this.categoryData = res.data.data;
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
            this.loading = true
            adminRequest.get('/book/page', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    isbn: this.searchForm.isbn,
                    title: this.searchForm.title,
                    categoryId: this.searchForm.categoryId,
                }
            }).then((res) => {
                if (res.data.code === 1) {
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                    this.bookData = res.data.data;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        addBook() {
            adminRequest.post('/book', this.addForm)
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
            adminRequest.put('/book', this.editForm)
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
                adminRequest.delete('/book/' + row.id)
                    .then((res) => {
                        if (res.data.code === 1) {
                            this.$message.success("删除成功");
                            this.loadData();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
            }).catch(() => { });
        },
        getBookInfo(row) {
            adminRequest.get('/book/' + row.id)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.bookInfo = res.data.data;
                        this.bookInfoVisible = true;
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            this.bookInfoVisible = true;
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
