<template>
    <el-container v-loading="loading" style="display: flex; flex-direction: column;">
        <el-form :model="searchForm" size="small" :inline="true">
            <el-form-item label="借书卡号">
                <el-input v-model="searchForm.readerNumber" placeholder="借书卡号"></el-input>
            </el-form-item>
            <el-form-item label="图书名称">
                <el-input v-model="searchForm.bookName" placeholder="图书名称"></el-input>
            </el-form-item>
            <el-form-item label="借书人">
                <el-input v-model="searchForm.readerName" placeholder="借书人"></el-input>
            </el-form-item>
            <el-form-item label="图书状态">
                <el-select v-model="searchForm.status" placeholder="图书状态" clearable>
                    <el-option label="未归还" value="0"></el-option>
                    <el-option label="已归还" value="1"></el-option>
                    <el-option label="已逾期" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="borrowData.records" tooltip-effect="dark" style="width: 100%">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column label="图书名称" width="180">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showBookTimeline(scope.row)">
                        {{ scope.row.bookName }}
                    </el-link>
                </template>
            </el-table-column>
            <el-table-column label="借书卡" prop="cardNumber" width="150"></el-table-column>
            <el-table-column label="借阅人" prop="readerName" width="100">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" @click="showReaderHistory(scope.row)">
                        {{ scope.row.readerName }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="借阅时间" prop="borrowTime" width="200"></el-table-column>
            <el-table-column label="还书时间" prop="actualReturnTime" width="200"></el-table-column>
            <el-table-column label="归还状态" prop="status" width="100">
                <template slot-scope="scope">
                    <el-tag :type="status[scope.row.status]">{{ status_text[scope.row.status] }}</el-tag>
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
                :total="borrowData.total">
            </el-pagination>
        </div>

        <!-- 页面对话框 -->
        <!-- 图书借阅时间线对话框 -->
        <el-dialog title="借阅时间线" :visible.sync="bookDetailVisible" width="30%">
            <div class="radio">
                排序：
                <el-radio-group v-model="reverse">
                    <el-radio :label="true">正序</el-radio>
                    <el-radio :label="false">倒序</el-radio>
                </el-radio-group>
            </div>
            <el-timeline :reverse="reverse" style="margin-top: 20px;">
                <el-timeline-item v-for="(item, index) in timelineData" :key="index" :timestamp="item.timestamp"
                    :type="item.color">
                    <p v-if="item.returned">
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.bookName }}
                        </el-link>
                        已归还
                    </p>
                    <p v-else>
                        <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.readerName }}
                        </el-link>
                        借阅了
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.bookName }}
                        </el-link>
                        <el-tag v-if="item.returned != 1 && item.color === 'warning'" type="danger" size="mini"
                            style="margin-left: 10px; vertical-align: baseline !important;">未归还</el-tag>
                        <el-tag v-if="item.returned != 1 && item.color === 'danger'" type="danger" size="mini"
                            style="margin-left: 10px; vertical-align: baseline !important;">已逾期</el-tag>
                    </p>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

        <!-- 读者借阅历史对话框 -->
        <el-dialog title="借阅历史" :visible.sync="readerHistoryVisible" width="30%">
            <div class="radio">
                排序：
                <el-radio-group v-model="reverse">
                    <el-radio :label="true">正序</el-radio>
                    <el-radio :label="false">倒序</el-radio>
                </el-radio-group>
            </div>
            <el-timeline :reverse="reverse" style="margin-top: 20px;">
                <el-timeline-item v-for="(item, index) in readerHistoryData" :key="index" :timestamp="item.timestamp"
                    :type="item.color">
                    <p v-if="item.returned">
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.bookName }}
                        </el-link>
                        已归还
                    </p>
                    <p v-else>
                        <el-link type="danger" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.readerName }}
                        </el-link>
                        借阅了
                        <el-link type="success" :underline="false" style="vertical-align: baseline !important;">
                            {{ item.bookName }}
                        </el-link>
                        <el-tag v-if="item.returned != 1 && item.color === 'warning'" type="danger" size="mini"
                            style="margin-left: 10px; vertical-align: baseline !important;">未归还</el-tag>
                        <el-tag v-if="item.returned != 1 && item.color === 'danger'" type="danger" size="mini"
                            style="margin-left: 10px; vertical-align: baseline !important;">已逾期</el-tag>
                    </p>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>

        <!-- 编辑对话框 -->
        <el-dialog title="编辑借阅记录" :visible.sync="editFormVisible" width="30rem">
            <el-form :model="editForm" label-width="7rem">
                <el-form-item label="借书卡号" required>
                    <el-input v-model="editForm.cardNumber"></el-input>
                </el-form-item>
                <el-form-item label="借阅时间" required>
                    <el-input v-model="editForm.borrowTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="应归还时间" required>
                    <el-date-picker v-model="editForm.returnTime" type="datetime" placeholder="选择日期" :clearable="false"
                        value-format="yyyy-MM-dd HH:mm:ss" style="width: calc(30rem - 46%);"></el-date-picker>
                </el-form-item>
                <el-form-item label="实际归还时间">
                    <el-date-picker v-model="editForm.actualReturnTime" type="datetime" placeholder="选择日期"
                        :disabled="editForm.status !== '1'" value-format="yyyy-MM-dd HH:mm:ss"
                        style="width: calc(30rem - 46%);"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" required>
                    <el-select v-model="editForm.status" placeholder="图书状态" style="width: calc(30rem - 46%);">
                        <el-option label="未归还" value="0"></el-option>
                        <el-option label="已归还" value="1"></el-option>
                        <el-option label="已逾期" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否逾期" required>
                    <el-radio-group v-model="editForm.overdue">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="逾期天数" required>
                    <el-input v-model="editForm.overdueDays" :disabled="editForm.overdue === false"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="submitInfo" size="small">确 定</el-button>
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
                cardNumber: '',
                bookName: '',
                readerName: '',
                status: ''
            },
            borrowData: [],
            status: ['warning', 'success', 'danger'],
            status_text: ['未归还 ', '已归还', '已逾期'],
            bookDetailVisible: false, // 图书借阅时间线弹窗
            readerHistoryVisible: false, // 读者借阅历史弹窗
            timelineData: [], // 时间线数据
            readerHistoryData: [], // 读者借阅历史数据
            reverse: true, // 时间线排序
            editFormVisible: false, // 编辑弹窗
            editForm: {
                id: '',
                bookId: '',
                readerId: '',
                cardNumber: '', // 借书卡号
                borrowTime: '', // 借阅时间
                returnTime: '', // 应归还时间
                actualReturnTime: '', // 实际归还时间
                status: '', // 状态
                overdue: '', // 是否逾期
                overdueDays: '', // 逾期天数
            },
            loading: true,
            loadingTime: 500
        }
    },
    methods: {
        loadData() {
            this.loading = true
            adminRequest.get("/borrow/page", {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.borrowData = res.data.data;
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
            adminRequest.get("/borrow/page", {
                params: {
                    page: this.currentPage,
                    pageSize: this.pageSize,
                    cardNumber: this.searchForm.cardNumber,
                    bookName: this.searchForm.bookName,
                    readerName: this.searchForm.readerName,
                    status: this.searchForm.status
                },
            }).then((res) => {
                if (res.data.code === 1) {
                    this.borrowData = res.data.data;
                    setTimeout(() => {
                        this.loading = false
                    }, this.loadingTime)
                } else {
                    this.$message.error(res.data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.loadData()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.loadData()
        },
        showBookTimeline(item) {
            adminRequest.get('/borrow/timeline', {
                params: {
                    bookId: item.bookId
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.timelineData = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            this.bookDetailVisible = true
        },
        showReaderHistory(item) {
            adminRequest.get('/borrow/history', {
                params: {
                    readerId: item.readerId
                }
            }).then(res => {
                if (res.data.code === 1) {
                    this.readerHistoryData = res.data.data
                } else {
                    this.$message.error(res.data.msg)
                }
            })
            this.readerHistoryVisible = true
        },
        deleteById(item) {
            this.$confirm('此操作将永久删除该借阅记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                adminRequest.delete('/borrow/' + item.id).then(res => {
                    if (res.data.code === 1) {
                        this.$message.success("删除成功")
                        this.loadData()
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            }).catch(() => { })
        },
        showEdit(row) {
            this.editFormVisible = true
            this.editForm = row
            this.editForm.status = row.status.toString()
        },
        submitInfo() {
            adminRequest.put('/borrow', this.editForm).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("编辑成功")
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