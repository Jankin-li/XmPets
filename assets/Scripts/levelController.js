cc.Class({
    extends: cc.Component,

    properties: {
        _coinNum: 0,//金钱数量
        nowStage: 1,//当前关卡
        nowStageTarget: 400,//当前关卡目标分数
        coinStep: 10,
        targetStep: 200,
    },

    onLoad() {
        cc.director.on('score', this.scoreCountToChangeLevel, this);
    },

    start() {
        cc.director.emit('stage', this.nowStage);
        cc.director.emit('scoretarget', this.nowStageTarget);
        let cons = parseInt(cc.sys.localStorage.getItem("coin"));
        if (isNaN(cons) == true) {
            this._coinNum = 0;
        } else {
            this._coinNum = cons;
        }
    },

    //用于关卡进阶
    scoreCountToChangeLevel(nowscore) {
        //当当前获得的分数大于关卡目标分数时,开启下一关
        if (nowscore >= this.nowStageTarget) {
            this.nowStageTarget += this.targetStep;
            this._coinNum += this.coinStep;
            this.nowStage += 1;
            //金币存入当前文件夹
            localStorage.setItem('coin', this._coinNum);
            cc.director.emit('stage', this.nowStage);
            cc.director.emit('scoretarget', this.nowStageTarget);
        }
    }
    // update (dt) {},
});
