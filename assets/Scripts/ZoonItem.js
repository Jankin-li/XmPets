cc.Class({
    extends: cc.Component,

    properties: {
        imagine : [cc.SpriteFrame],
        _index: 0,
        index: {
            type: cc.Integer,
            set(value) {
                if (value < 0) {
                    return;
                }
                this._index = value % this.imagine.length;
                let sprite = this.node.getComponent(cc.Sprite);
                sprite.spriteFrame = this.imagine[this._index];
            },
            get(){
                return this._index;
            }
        },
        colLocal:0,
        rowLocal:0,
    },

    next(){
        this.index++;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start() {},
   
    // update (dt) {},
});
