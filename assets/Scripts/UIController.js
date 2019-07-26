cc.Class({
    extends: cc.Component,

    properties: {
        scoreGotLabel: cc.Label,
        scoreTargetLabel: cc.Label,
    },


    start() {
        cc.director.on('score',this.scoreGotLabelChange,this);
    },

    scoreGotLabelChange(score) {
        this.scoreGotLabel.string = score;
    }

    // update (dt) {},
});
