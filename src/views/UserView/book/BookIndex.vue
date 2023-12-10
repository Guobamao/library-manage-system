<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column;">
        <el-form :inline="true" :model="searchForm" size="small">
            <el-form-item label="图书关键词">
                <el-input v-model="searchForm.keyword" placeholder="图书名称/类别/作者/出版社/ISBN" clearable></el-input>
            </el-form-item>
            <el-form-item label="图书类别">
                <el-select v-model="searchForm.categoryId" clearable placeholder="图书分类">
                    <el-tooltip v-for="item in categoryData" :key="item.id" class="item" effect="light"
                        :content="item.description" placement="top">
                        <el-option :label="item.name" :value="item.id">
                        </el-option>
                    </el-tooltip>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="bookData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column width="50"></el-table-column>
            <el-table-column label="图书名称" prop="title" width="200">
                <template slot-scope="scope">
                    <el-link :underline="false" type="primary" @click="getBookInfo(scope.row)">
                        {{ scope.row.title }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="作者" prop="author" width="200"></el-table-column>
            <el-table-column label="图书类型" prop="categoryName" width="150"></el-table-column>
            <el-table-column label="出版社" prop="publisher" width="200"></el-table-column>
            <el-table-column label="价格" width="100">
                <template slot-scope="scope">
                    ￥{{ scope.row.price }}
                </template>
            </el-table-column>
            <el-table-column label="语言" prop="language" width="150"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" plain size="mini" @click="borrowBook(scope.row)">借阅</el-button>
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
        <!-- 显示图书信息对话框 -->
        <el-dialog title="图书信息" :visible.sync="bookInfoVisible">
            <el-descriptions :column="2" border direction="vertical">
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
                    <template slot="label">当前数量</template>
                    {{ bookInfo.quantity }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template slot="label">语言</template>
                    {{ bookInfo.language }}
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
    </el-container>
</template>

<script>
import { userRequest } from '@/api';
export default {
    data() {
        return {
            loading: false,
            loadingTime: 500,
            searchForm: {
                keyword: '',
                categoryId: '',
            },
            categoryData: [],
            bookData: [],
            bookInfo: [],
            bookInfoVisible: false,
        }
    },
    methods: {
        loadData() {
            this.loading = true;
            userRequest.get('/user/book', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.bookData = res.data.data
                    setTimeout(() => {
                        this.loading = false;
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            userRequest.get('/user/book/category')
                .then(res => {
                    if (res.data.code === 1) {
                        this.categoryData = res.data.data;
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
        search() {
            this.loading = true;
            userRequest.get('/user/book', {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    keyword: this.searchForm.keyword,
                    categoryId: this.searchForm.categoryId,
                }
            }).then((res) => {
                if (res.data.code === 1) {
                    setTimeout(() => {
                        this.loading = false;
                    }, this.loadingTime)
                    this.bookData = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getBookInfo(row) {
            userRequest.get('/user/book/' + row.id)
                .then((res) => {
                    if (res.data.code === 1) {
                        this.bookInfo = res.data.data;
                        this.bookInfoVisible = true;
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            this.bookInfoVisible = true;
        },

    },
    created() {
        this.currentPage = 1
        this.pageSize = 10
        this.loadData();
    }
}
</script>