

cc.Class({
    extends: cc.Component,

    properties: {
        iconPrefabs: cc.Prefab,
        RowMax: 9,//行的个数 row是行号
        ColMax: 7,//列的个数 col是列号
        startPosX: 0,
        startPosY: 0,
        startIntervalX: 10,
        startIntervalY: 10,
        _IconAryy: [],
        dropSpeed: 1.5,
        ScoreStart: 15,
        ScoreStep: 10,
        baseScore: 0,
        scoreGotLabel: cc.Label,
    },

    instantiateNewItem: function () {
        let iconPrefab = cc.instantiate(this.iconPrefabs);
        iconPrefab.getComponent('ZoonItem').index = Math.floor(Math.random() * 10 % 7);
        //初始化坐标
        let startPos = cc.v2(endPos.x, endPos.y + cc.winSize.height);//生成坐标
        this.node.addChild(iconPrefab);//将实例化的物体添加为框的子节点
        iconPrefab.setPosition(startPos);//设置生成坐标
    },

    setIconInTheLay: function () {
        for (var row = 0; row < this.RowMax; row++) {
            for (var col = 0; col < this.ColMax; col++) {
                let iconPrefab = cc.instantiate(this.iconPrefabs);
                iconPrefab.getComponent('ZoonItem').index = Math.floor(Math.random() * 10 % 7);


                //设置实例化的坐标
                iconPrefab.rowLocal = row;
                iconPrefab.colLocal = col;

                //初始化坐标
                let endPos = this.countPos(col, row);//降落坐标
                let startPos = cc.v2(endPos.x, endPos.y + cc.winSize.height);//生成坐标
                this.node.addChild(iconPrefab);//将实例化的物体添加为框的子节点
                iconPrefab.setPosition(startPos);//设置生成坐标
                let duration = startPos.y / (cc.winSize.height / this.dropSpeed);//计算降落时间
                let moveTo = cc.moveTo(duration, endPos);//设置动画
                iconPrefab.runAction(moveTo);//播放动作

                this._IconAryy.push(iconPrefab);//弹入一维数组中保存

                //对于实例化的物体进行点击注册
                iconPrefab.on(cc.Node.EventType.TOUCH_END, (evenTouch) => {
                    //临时数组
                    this.deletArry = [];
                    //遍历相同  
                    this.countItemDelet(iconPrefab);
                    //分数处理
                    this.countScore();
                    //删除
                    if (this.deletArry.length > 1) {
                        this.deletArry.forEach(function (element) {
                            let i = element.rowLocal * this.ColMax + element.colLocal;
                            this._IconAryy[i] = null;
                            element.destroy();
                        }.bind(this));
                    } else {
                        iconPrefab.isSerched = false;
                    };
                    //Item 掉落补充
                    // this.dropTheItem();
                }, this);
            }
        }
    },


    // //掉落补充
    dropTheItem() {
        // let arrayOfNull=[];
        //先遍历行再遍历列
        for (var row = 0; row < this.RowMax; row++) {
            let blankNum = 0;//空格数
            for (let col = 0; col < this.ColMax; col++) {
                //对于当前的位置进行计算索引
                let idx = col + row * this.ColMax;
                //对于当前索引原数组中的值进行判断 如果非空就对其进行操作,为空就对blankNum++
                if (!this._IconAryy[idx]) {
                    blankNum++;
                    continue;
                } else {
                    if (blankNum > 0) {
                        //上一行同一列的空格的位置的索引
                        let oldIdx = col + (row - 1) * this.ColMax;
                        //将当前的物体移动前面的空格中
                        let newItemPull =this._IconAryy[oldIdx];
                        newItemPull = this._IconAryy[idx];
                        //设置移动过后的新坐标
                        this._IconAryy[oldIdx].rowLocal = row - 1;
                        this._IconAryy[oldIdx].colLocal = col;
                        //计算坐标位置同时调用动画
                        let endPos = this.countPos(col, row - 1)
                        let duration=this._IconAryy[oldIdx].y/(this._IconAryy[oldIdx].y/this.dropSpeed);
                        let moveTo = cc.moveTo(duration, endPos);//设置动画
                        this._IconAryy[oldIdx].stopAction(moveTo);
                        this._IconAryy[oldIdx].runAction(moveTo);//播放动作
                    } else { continue; }
                }
                // for (let n = 0; n <= blankNum; n++) {
                //     this.instantiateNewItem();
                // }
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
        let score = (this.ScoreStep * (length - 1) + this.ScoreStart * 2) * 1 * length / 2;
        //总分计算
        this.baseScore = score + this.baseScore;
        this.scoreGotLabel.string = "" + this.baseScore;//更新文本
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
        let x = this.startPosX + (this.node.width / this.ColMax) * cols;//在哪一列
        let y = this.startPosY + (this.node.height / this.RowMax) * rows;//在哪一行
        return cc.v2(x, y);
    },
    // 老师的算法:
    // countPositon: function (cols, rows, e) {
    //     let x = this.startPosX+ this.interValSizeX + (e.width ) * cols;
    //     let y = this.startPosY+ this.interValSizeY + (e.height ) * rows;
    //     cc.log(x, y);
    //     return cc.v2(x, y);
    // },

    onLoad() {

        var iconPrefab = cc.instantiate(this.iconPrefabs);
        this.startPosX = (-this.node.width + iconPrefab.width) / 2 + this.startIntervalX;
        this.startPosY = (-this.node.height + iconPrefab.height) / 2 + this.startIntervalY;
    },

    start() {

        this.setIconInTheLay();
    },

    // update(dt) {},
});