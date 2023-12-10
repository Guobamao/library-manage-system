import { userRequest } from "@/api";

export default {
    // 显示借书卡信息
    showCardInfo() {
        userRequest.get("/card/info")
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
                            this.cardApply();
                        }).catch(() => { })
                    } else if (res.data.msg === '已申请，请勿重复申请') {
                        this.showApplyStatus();
                    }
                }
            })
    },
    // 申请借书卡
    cardApply() {
        userRequest.post("/card/apply")
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
    cardReport() {
        userRequest.post("/card/report")
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
    showApplyStatus() {
        userRequest.get("/card/status")
            .then(res => {
                if (res.data.code === 1) {
                    this.applyCardStatus = res.data.data;
                    this.applyCardDialogVisible = true;
                } else {
                    this.$message.error(res.data.msg);
                }
            })
    },
}