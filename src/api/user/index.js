import { userRequest } from "@/api";

export default {
    // 显示借书卡信息
    showCardInfo(readerId) {
        userRequest.get("/card/info/" + readerId)
            .then(res => {
                if (res.data.code === 1) {
                    this.cardInfo = res.data.data;
                    this.cardInfoDialogVisible = true;
                } else {
                    if (res.data.msg === '未申请借书卡') {
                        this.$confirm("您还未申请借书卡，是否立即申请？", "提示", {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning"
                        }).then(() => {
                            this.cardApply(readerId);
                        }).catch(() => { })
                    } else if (res.data.msg === '已申请，请勿重复申请') {
                        this.showApplyStatus(readerId);
                    }
                }
            })
    },
    // 申请借书卡
    cardApply(readerId) {
        userRequest.post("/card/apply/" + readerId)
            .then(res => {
                if (res.data.code === 1) {
                    this.$message.success("申请成功");
                    this.cardInfoDialogVisible = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    },
    // 挂失借书卡
    cardReport(readerId) {
        userRequest.post("/card/report/" + readerId)
            .then(res => {
                if (res.data.code === 1) {
                    this.$message.success("挂失成功");
                    this.cardInfoDialogVisible = false;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    },
    // 显示借书卡申请进度
    showApplyStatus(readerId) {
        userRequest.get("/card/status/" + readerId)
            .then(res => {
                if (res.data.code === 1) {
                    this.applyCardStatus = res.data.data;
                    this.applyCardDialogVisible = true;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    }
}