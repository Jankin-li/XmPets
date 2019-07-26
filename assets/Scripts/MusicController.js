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
        // switch (deletArry.length) {
        //     case 2: cc.audioEngine.play(this.deletAudios[0], false, 1); return;
        //     case 3: cc.audioEngine.play(this.deletAudios[1], false, 1); return;
        //     case 4: cc.audioEngine.play(this.deletAudios[2], false, 1); return;
        //     case 5: cc.audioEngine.play(this.deletAudios[3], false, 1); return;
        //     case 6: cc.audioEngine.play(this.deletAudios[4], false, 1); return;
        //     case 7: cc.audioEngine.play(this.deletAudios[5], false, 1); return;
        //     case 8: cc.audioEngine.play(this.deletAudios[6], false, 1); return;
        //     case 9: cc.audioEngine.play(this.deletAudios[7], false, 1); return;
        // }
        for (let i = 0; i < this.deletAudios.length; i++) {
            if (i === deletArry.length) {
                cc.audioEngine.play(this.deletAudios[i-2], false, 1); return;
            }
        }
    },
    // update (dt) {},
});
