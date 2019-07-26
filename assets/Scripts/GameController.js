
let itemActivePreArray = [];
cc.Class({
    extends: cc.Component,

    properties: {
        iconPrefabs: cc.Prefab,
        RowMax: 9,//行的个数 row是行号
        ColMax: 7,//列的个数 col是列号
        _startPosX: 0,//开始位置X
        _startPosY: 0,//开始位置Y
        startIntervalX: 10,//左右间距
        startIntervalY: 10,//上下间距
        _IconAryy: [],//全局数组,用于存储
        dropSpeed: 1.5,//掉落速度
        ScoreStart: 15,//加分开始值
        ScoreStep: 10,//加分值
        baseScore: 0,//总分
        effect: cc.Prefab,//获取特效组件

    },

    //生成Item
    instantiateNewItem: function (endPos) {
        let iconPrefab = cc.instantiate(this.iconPrefabs);
        let itemIdex = Math.floor(Math.random() * 10 % 7);
        iconPrefab.getComponent('ZoonItem').index = itemIdex;
        var anim = iconPrefab.getComponent(cc.Animation);
        //初始化坐标
        let startPos = cc.v2(endPos.x, endPos.y + cc.winSize.height);//生成坐标
        this.node.addChild(iconPrefab);//将实例化的物体添加为框的子节点
        iconPrefab.setPosition(startPos);//设置生成坐标

        let duration = this.dropSpeed / 3;//计算降落时间
        this._IconAryy.push(iconPrefab);//弹入一维数组中保存       
        let moveTo = cc.moveTo(duration, endPos);//设置动画
        var callFunc = cc.callFunc(() => { });
        let delayAct = cc.delayTime(0.2);
        let sequence = cc.sequence(delayAct, moveTo, callFunc);
        iconPrefab.runAction(sequence);//播放动作

        // cc.js.formatStr()
        //对于实例化的物体进行点击注册
        //点击时有背景
        iconPrefab.on(cc.Node.EventType.TOUCH_START, (evenTouch) => {
            anim.play('changeSelect');
        });

        iconPrefab.on(cc.Node.EventType.TOUCH_CANCEL,evenTouch=>{
            anim.stop('changeSelect');
            anim.play('back');
        })
        //松开点击时背景取消同时进行消除算法
        iconPrefab.on(cc.Node.EventType.TOUCH_END, (evenTouch) => {
            anim.stop('changeSelect');
            anim.play('back');
            //临时数组
            this.deletArry = [];
            //遍历相同  
            this.countItemDelet(iconPrefab);
            //分数处理
            this.countScore();
            if (this.deletArry.length > 1) {
                let n = 0;//累积器
                //播放音效
                cc.director.emit('music', this.deletArry);
                //删除
                this.deletArry.forEach(function (element) {
                    //实例化特效
                    let effectInStantiate = cc.instantiate(this.effect);
                    this.node.addChild(effectInStantiate);
                    let setPos = this.countPos(element.colLocal, element.rowLocal);
                    effectInStantiate.setPosition(setPos);
                    //回调器,用于摧毁特效对象
                    let callFunc = cc.callFunc(() => {
                        effectInStantiate.destroy();
                    });
                    //更改特效中Label的数值
                    effectInStantiate.getComponentInChildren(cc.Label).string = '' + (this.ScoreStart + this.ScoreStep * n);//分数显示

                    //计算索引
                    let i = element.rowLocal * this.ColMax + element.colLocal;
                    this._IconAryy[i] = null;//清空数组在当前位置的内存
                    element.destroy();//当前Item摧毁
                    //特效延时摧毁器
                    let delayAct = cc.delayTime(0.4);
                    let sequence = cc.sequence(delayAct, callFunc);
                    effectInStantiate.runAction(sequence);
                    n++;//累加
                }.bind(this));
                this.dropTheItem();
            } else {
                iconPrefab.isSerched = false;
            }
        }, this);

        return iconPrefab;
    },



    //开局初始化
    setIconInTheLay: function () {
        for (let row = 0; row < this.RowMax; row++) {
            for (let col = 0; col < this.ColMax; col++) {
                //初始化坐标
                let endPos = this.countPos(col, row);//降落坐标
                let iconPrefab = this.instantiateNewItem(endPos);
                //设置实例化的坐标
                iconPrefab.rowLocal = row;
                iconPrefab.colLocal = col;
            }
        }
    },
    //独立出删除功能
    onDeletItem: function (iconPrefab) {

    },


    // //掉落补充
    dropTheItem() {
        //
        for (let col = 0; col < this.ColMax; col++) {
            let blankNum = 0;//空格数
            for (let row = 0; row < this.RowMax; row++) {
                //对于当前的位置进行计算索引
                let idx = col + row * this.ColMax;
                //对于当前索引原数组中的值进行判断 如果非空就对其进行操作,为空就对blankNum++
                if (!this._IconAryy[idx]) {
                    blankNum++;
                    continue;
                } else {
                    if (blankNum > 0) {
                        //上一行同一列的空格的位置的索引
                        let oldIdx = col + (row - blankNum) * this.ColMax;
                        //将当前的物体移动前面的空格中
                        let newItemPull = this._IconAryy[idx];
                        this._IconAryy[idx] = null;
                        this._IconAryy[oldIdx] = newItemPull;
                        //设置移动过后的新坐标
                        newItemPull.rowLocal = row - blankNum;
                        newItemPull.colLocal = col;
                        let nowRow = row - blankNum;
                        //计算坐标位置同时调用动画
                        let endPos = this.countPos(col, nowRow);
                        let duration = (this.dropSpeed / 5);
                        let moveTo = cc.moveTo(duration, endPos);//设置动画
                        newItemPull.stopAllActions();
                        //延迟掉落
                        var callFunc = cc.callFunc(() => {});
                        let delayAct = cc.delayTime(0.2);
                        let sequence = cc.sequence(delayAct, moveTo, callFunc);
                        newItemPull.runAction(sequence);//播放动zuo
                    }
                }
            }
            this.addNewItem(col);
        }
    },

    //补充Item
    addNewItem(col) {
        for (let row = 0; row < this.RowMax; row++) {
            //对于当前的位置进行计算索引
            let idx = col + row * this.ColMax;
            //如果当前位置为空
            if (this._IconAryy[idx] == null) {
                //在对应的位置的上方生成一个Item
                //初始化坐标位置
                let endPos = this.countPos(col, row);//降落坐标
                let iconPrefab = this.instantiateNewItem(endPos);
                //设置实例化的坐标
                iconPrefab.rowLocal = row;
                iconPrefab.colLocal = col;
                this._IconAryy[idx] = iconPrefab;
            }
        }
    },

    //分数计算 DONE!
    countScore: function () {
        let length = this.deletArry.length;
        if (length === 1) {
            return;
        }
        //得分计算
        let score = this.ScoreStart;
        for (let m = 0; m < length; m++) {
            score = score + this.ScoreStep;
        }
        //总分计算
        this.baseScore = score + this.baseScore;
        cc.director.emit('score', this.baseScore);
        return score;
    },

    countItemDelet: function (curretTarget) {
        if (curretTarget.isSerched) {
            return;//当前目标若搜寻过则跳过防止死循环
        }
        curretTarget.isSerched = true;//第一次搜寻到对其设置状态
        this.deletArry.push(curretTarget);
        //存储即将搜寻的位置
        let col = curretTarget.colLocal;
        let row = curretTarget.rowLocal;
        let arr = [
            { col: col - 1, row: row },
            { col: col + 1, row: row },
            { col: col, row: row - 1 },
            { col: col, row: row + 1 }
        ];//存储点击的位置的周围坐标

        for (let i = 0; i < arr.length; i++) {
            let currentIndex = arr[i];
            if (currentIndex.col < 0 || currentIndex.col >= this.ColMax || currentIndex.row < 0 || currentIndex.row >= this.RowMax) {
                continue;
            }

            let idx = currentIndex.row * this.ColMax + currentIndex.col;//原数组索引计算
            let currentItem = this._IconAryy[idx];
            // cc.log(currentItem);
            if (!currentItem) {
                continue;
            }
            if (currentItem.getComponent('ZoonItem').index === curretTarget.getComponent('ZoonItem').index) {
                this.countItemDelet(currentItem);//递归
            }
        }
        //当前结点遍历完毕已无相同图片时 递归结束 存入数组中

    },

    //自己想法:
    countPos(cols, rows) {
        let x = this._startPosX + (this.node.width / this.ColMax) * cols;//在哪一列
        let y = this._startPosY + (this.node.height / this.RowMax) * rows;//在哪一行
        return cc.v2(x, y);
    },
    // 老师的算法:
    // countPositon: function (cols, rows, e) {
    //     let x = this._startPosX+ this.interValSizeX + (e.width ) * cols;
    //     let y = this._startPosY+ this.interValSizeY + (e.height ) * rows;
    //     cc.log(x, y);
    //     return cc.v2(x, y);
    // },

    onLoad() {
        var iconPrefab = cc.instantiate(this.iconPrefabs);
        this._startPosX = (-this.node.width + iconPrefab.width) / 2 + this.startIntervalX;
        this._startPosY = (-this.node.height + iconPrefab.height) / 2 + this.startIntervalY;
    },

    start() {
        this.setIconInTheLay();
    },

    // update(dt) {},
});
