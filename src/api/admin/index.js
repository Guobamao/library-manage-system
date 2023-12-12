import { adminRequest } from "@/api";

export default {
    // 处理待处理的借书卡申请消息
    cardPass(row) {
        adminRequest.post("/process/card/pass", {
            readerId: row.readerId,
            type: row.type
        }).then(res => {
            if (res.data.code === 1) {
                this.$message.success("操作成功");
                this.getUnsolvedCount();
                this.showUnsolvedDialog();
            } else {
                this.$message.error(res.data.msg);
            }
        })
    },
    // 驳回待处理的借书卡申请消息
    cardReject(row) {
        adminRequest.post("/process/card/reject", {
            readerId: row.readerId,
            type: row.type
        }).then(res => {
            if (res.data.code === 1) {
                this.$message.success("操作成功");
                this.getUnsolvedCount();
                this.showUnsolvedDialog();
            } else {
                this.$message.error(res.data.msg);
            }
        })
    },
    // 处理待处理的图书借阅消息
    bookPass(row) {
        if (row.type === 0) {
            adminRequest.post("/process/book/borrow/pass", {
                readerId: row.readerId,
                bookId: row.bookId,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("操作成功");
                    this.getUnsolvedCount();
                    this.showUnsolvedDialog();
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        } else {
            adminRequest.post("/process/book/return/pass", {
                readerId: row.readerId,
                bookId: row.bookId,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("操作成功");
                    this.getUnsolvedCount();
                    this.showUnsolvedDialog();
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        }
    },
    // 驳回待处理的图书借阅消息
    bookReject(row) {
        if (row.type === 0) {
            adminRequest.post("/process/book/borrow/reject", {
                readerId: row.readerId,
                bookId: row.bookId,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("操作成功");
                    this.getUnsolvedCount();
                    this.showUnsolvedDialog();
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        } else {
            adminRequest.post("/process/book/return/reject", {
                readerId: row.readerId,
                bookId: row.bookId,
            }).then(res => {
                if (res.data.code === 1) {
                    this.$message.success("操作成功");
                    this.getUnsolvedCount();
                    this.showUnsolvedDialog();
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        }
    }
}