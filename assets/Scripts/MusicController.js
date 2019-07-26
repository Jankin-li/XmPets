cc.Class({
    extends: cc.Component,

    properties: {
        deletAudios: {
            type: cc.AudioClip,
            default: [],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        cc.director.on('music', this.playDeletAudios, this);
    },

    playDeletAudios(deletArry) {
        if (deletArry.length > 9) {
            cc.audioEngine.play(this.deletAudios[7], false, 1); return;
        }

        cc.audioEngine.play(this.deletAudios[deletArry.length - 2], false, 1); return;

    },
    // update (dt) {},
});
