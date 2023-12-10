import { adminRequest } from "@/api";

export default {
    // 获取待处理的消息数量
    getUnsolvedCount() {
        adminRequest.get("/message/count")
            .then(res => {
                if (res.data.code === 1) {
                    this.unsolvedCount = res.data.data;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    },
    // 显示待处理的消息
    showUnsolvedDialog() {
        this.drawerVisible = true;
        adminRequest.get("/process/list")
            .then(res => {
                if (res.data.code === 1) {
                    this.cardApplyData = res.data.data;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    },
    // 处理待处理的消息
    pass(row) {
        adminRequest.post("/process/pass", {
            readerId: row.readerId,
            type: row.type
        }).then(res => {
            if (res.data.code === 1) {
                this.$message.success("操作成功");
                this.getUnsolvedCount();
                this.drawerVisible = false;
            } else {
                this.$message.error(res.data.msg);
            }
        })
    },
    // 驳回待处理的消息
    reject(row) {
        adminRequest.post("/process/reject", {
            readerId: row.readerId,
            type: row.type
        }).then(res => {
            if (res.data.code === 1) {
                this.$message.success("操作成功");
                this.getUnsolvedCount();
                this.drawerVisible = false;
            } else {
                this.$message.error(res.data.msg);
            }
        })
    }
}