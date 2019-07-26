cc.Class({
    extends: cc.Component,

    properties: {
        scoreGotLabel: cc.Label,
        scoreTargetLabel: cc.Label,
        coinNumLabel: cc.Label,
        StageNumLabel: cc.Label,
    },

    onLoad() {
        cc.director.on('scoretarget', this.scoreTarget, this);//开局传值进来
        cc.director.on('stage', this.stageSet, this);
    },

    start() {
        this.loadTheData();
        // 当前分数 金币 目标分数 关卡  
        cc.director.on('score', this.scoreGotLabelChange, this);
        //too do coin 从文件夹中读取

    },

    loadTheData() {
        let coin = parseInt(cc.sys.localStorage.getItem("coin"));
        if (isNaN(coin) == true) {
            this.coinNumLabel.string = 0;
        } else {
            this.coinNumLabel.string = coin;
        }
    },

    scoreTarget(target) {
        this.scoreTargetLabel.string = target;
    },

    stageSet(stage) {
        this.StageNumLabel.string = stage;
    },

    coinGotChange() {
        let coin = parseInt(cc.sys.localStorage.getItem("coin"));
        if (isNaN(coin) == true) {
            this.coinNumLabel.string = 0;
        } else {
            this.coinNumLabel.string = coin;
        }
    },
    scoreGotLabelChange(score) {
        this.scoreGotLabel.string = score;
    },

    update(dt) {
        this.coinGotChange();
    },
});
