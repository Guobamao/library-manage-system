<template>
    <el-container style="display: flex; flex-direction: column;">
        <el-form :inline="true" :model="formInline">
            <el-form-item label="借书卡">
                <el-input v-model="formInline.user" placeholder="借书卡"></el-input>
            </el-form-item>
            <el-form-item label="图书名称">
                <el-input v-model="formInline.bookName" placeholder="图书名称"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="formInline.region" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column label="图书名称" width="180">
                <template slot-scope="scope">
                    <el-link type="primary" @click="dialogBookVisible = true">{{ scope.row.bookName }}</el-link>
                    <el-dialog title="借阅时间线" :visible.sync="dialogBookVisible" width="30%">
                        <el-timeline :reverse="reverse">
                            <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                :timestamp="activity.timestamp">
                                {{ activity.content }}
                            </el-timeline-item>
                        </el-timeline>
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column prop="cardId" label="借书卡" width="180">
            </el-table-column>
            <el-table-column label="借阅人" width="180">
                <template slot-scope="scope">
                    <el-link type="primary" @click="dialogUserVisible = true">{{ scope.row.readerName }}</el-link>
                    <el-dialog title="借阅时间线" :visible.sync="dialogUserVisible" width="30%">
                        <el-timeline :reverse="reverse">
                            <el-timeline-item v-for="(activity, index) in activities" :key="index"
                                :timestamp="activity.timestamp">
                                {{ activity.content }}
                            </el-timeline-item>
                        </el-timeline>
                    </el-dialog>
                </template>
            </el-table-column>
            <el-table-column prop="lendTime" label="借阅时间" width="180">
            </el-table-column>
            <el-table-column prop="returnTime" label="还书时间" width="180">
            </el-table-column>
            <el-table-column label="当前状态" width="180">
                <template slot-scope="scope">
                    <el-tag :type="status[scope.row.status]">{{ status_text[scope.row.status] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-button type="primary" size="mini" plain>编辑</el-button>
                    <el-button type="danger" size="mini" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100"
                layout="total, sizes, prev, pager, next, jumper" :total="400">
            </el-pagination>
        </div>
    </el-container>
</template>
  
<script>
export default {
    data() {
        return {
            tableData: [{
                bookName: '三国演义',
                cardId: '2016010101',
                readerName: '张三',
                lendTime: '2016-05-02',
                returnTime: '2016-05-02',
                status: 0 // 0: 已借阅, 1: 已归还 2: 已超期 3: 已丢失
            }, {
                bookName: '西游记',
                cardId: '2016010102',
                readerName: '李四',
                lendTime: '2016-05-02',
                returnTime: '2016-05-02',
                status: 1
            }, {
                bookName: '水浒传',
                cardId: '2016010103',
                readerName: '王五',
                lendTime: '2016-05-02',
                returnTime: '2016-05-02',
                status: 2
            }, {
                bookName: '红楼梦',
                cardId: '2016010104',
                readerName: '赵六',
                lendTime: '2016-05-02',
                returnTime: '2016-05-02',
                status: 3
            }],
            formInline: {
                user: '',
                bookName: '',
                region: ''
            },
            status: ['', 'success', 'warning', 'danger'],
            status_text: ['已借阅', '已归还', '已超期', '已丢失'],
            dialogBookVisible: false,
            dialogUserVisible: false,
            reverse: false,
            activities: [{
                content: '活动按期开始',
                timestamp: '2018-04-15'
            }, {
                content: '通过审核',
                timestamp: '2018-04-13'
            }, {
                content: '创建成功',
                timestamp: '2018-04-11'
            }]
        }
    },
    methods: {
    }
}
</script>