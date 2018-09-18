// pages/shopping/product/product.js
const __USER__ = require('../../../services/credential.service.js');
const __SHOPPING__ = require('../../../services/wechat.pay.service.js');
const __URI__ = require('../../../utils/uri.constant.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        swiperHeight: 320, //  滚动图片的高度
        product: {}, //  商品信息
        amount: 1, //  当前SKU的购买数量
        price: '0.01', //  当前SKU的单位价格
        remaining: 0, //  当前SKU剩余的库存
        chosenSkuId: 0, //  选中的SKU的ID
        chosenItems: [], //  已选择的参数
        toView: '', //  定位至View的Id
        scrollViewHeight: 0, //  ScrollView的高度
        isHidden: true, //	是否隐藏video组件
        videoContext: null, //  视频模块上下文
        videoUrl: '', //	视频播放地址
        isReady: false, //商品信息是否已获取
        history: [], //用户下过的订单
        cards: [], //用户已领取的卡券
        showCardButton: false //是否显示卡券按键
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;

        //	商品ID
        that.data.product.pid = options.pid;
        // 获取详细数据
        __SHOPPING__
            .fetchProductDetail(options.pid)
            .then(res => {
                console.log(res)
                if (0 === res.data.code) { //	code: 0 返回正确结果
                    //	商品标题
                    that.data.product.name = decodeURIComponent(res.data.msg.product[0].name);
                    //  商品详情
                    that.data.product.description = decodeURIComponent(res.data.msg.product[0].description);
                    //  商品类型
                    that.data.product.type = res.data.msg.product[0].type;
                    that.data.product.freight = 0; // 初始设置运费为 0
                    //  赋值 skuList
                    that.data.product.sku = res.data.msg.skuList;
                    let isHit, standards = [];
                    //  遍历规格数组
                    for (let i = 0; i < res.data.msg.standards.length; i++) {
                        isHit = false;
                        for (let j = 0; j < standards.length; j++) {
                            if (standards[j].attribute === res.data.msg.standards[i].name) {
                                isHit = true;
                                //	聚集有相同的 attribute 的 属性值 
                                standards[j].collections.push({
                                    skuValueId: res.data.msg.standards[i].vid,
                                    value: res.data.msg.standards[i].value
                                })
                            } /** end of if */
                        } /** end of for */
                        if (!isHit) { // 如果未命中
                            standards.push({ // 则添加为新元素 属性名 + 值 
                                attribute: res.data.msg.standards[i].name,
                                collections: [{
                                    skuValueId: res.data.msg.standards[i].vid,
                                    value: res.data.msg.standards[i].value
                                }]
                            })
                        } /** end of if */
                    } /**	end of for */
                    //  赋值 standards
                    that.data.product.standards = standards;
                    //  获取SKU的单价数组
                    const units = that.data.product.sku.map((item) => {
                        return item.unit;
                    });
                    //  商品微缩图
                    that.data.product.thumbnails = res.data.msg.gallery
                        .filter(image => {
                            return image.type === 0;
                        })
                        .map(image => {
                            image.name = __URI__.imageUrlPrefix(image.name);
                            return image;
                        })
                    //  商品详情图
                    that.data.product.gallery = res.data.msg.gallery
                        .filter(image => {
                            return image.type === 1;
                        })
                        .map(image => {
                            image.name = __URI__.imageUrlPrefix(image.name);
                            return image;
                        })
                    //  商品视频
                    that.data.product.videos = res.data.msg.gallery
                        .filter(image => {
                            return image.type === 2;
                        })
                        .map(image => {
                            image.name = __URI__.imageUrlPrefix(image.name);
                            that.data.product.thumbnails.unshift(image);
                            return image;
                        })
                    console.log(that.data.product);

                    /**
                     * 如果商品当前的属性，以及属性下的值个数仅为1
                     * 则默认选中
                     */
                    if (that.data.product.standards.length === 1 &&
                        that.data.product.standards[0].collections.length === 1) {
                        that.selectSKU(that.data.product.standards[0].attribute,
                            that.data.product.standards[0].collections[0].skuValueId
                        );
                    } else {
                        that.setData({
                            isReady: true,
                            product: that.data.product,
                            price: Math.min.apply(null, units) + ' ~ ' + Math.max.apply(null, units)
                        });
                    }
                }
            });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        /**
         * 创建并返回 video 上下文 videoContext 对象。
         * 在自定义组件下，第二个参数传入组件实例this，以操作组件内 <video/> 组件
         */
        this.videoContext = wx.createVideoContext('productIntroVideo', this);
        this.everBoughtWrapper();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        const scale = wx.getStorageSync('__WindowScale__');
        //	滚动定位
        this.setData({
            scrollViewHeight: scale.height,
            swiperHeight: scale.width
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(options) {
        return {
            title: this.data.product.name,
            path: '/pages/shopping/product/product?pid=' + this.data.product.pid,
            imageUrl: this.data.product.thumbnails[0].name
        }

    },

    /**
     *   跳转至商城
     */
    bindTapBackToMall: function(e) {
        wx.redirectTo({
            url: '/pages/shopping/index/index',
        })
    },

    /**
     *   跳转至购物车
     */
    bindTapBackToCart: function(e) {
        wx.navigateTo({
            url: '/pages/shopping/cart/cart',
        })
    },

    /**
     *   加入购物车
     */
    bindTapJoinToCart: function(e) {
        var index,
            _cart = [];

        index = this.isHit();
        // 如果商品参数未全部设定，则将页面滚动至指定位置
        if (index === -1) {
            this.setData({
                toView: 'intro'
            })
        } else {
            _cart.push({
                stock_no: this.data.chosenSkuId,
                amount: this.data.amount,
            });

            __USER__
                .joinToCart(
                    wx.getStorageSync('__SESSION_KEY__'),
                    JSON.stringify(_cart)
                )
                .then((res) => {
                    console.log(res);
                    wx.showToast({
                        title: '已放入购物车',
                        icon: 'success',
                        duration: 3000
                    })
                });
        }
    },

    /**
     *    购买
     */
    bindTapBuy: function(e) {
        var i,
            length,
            index,
            attributes = [],
            _cart = [];

        if (this.data.isReady === false) {
            wx.showToast({
                title: '加载中',
                image: "/icons/public/hint.png"
            })
            return;
        }

        index = this.isHit();
        // 如果商品参数未全部设定，则将页面滚动至指定位置
        if (index === -1) {
            this.setData({
                toView: 'intro'
            })
        } else {
            if (0 === this.data.remaining) {
                wx.showToast({
                    title: '没有库存',
                    image: "/icons/public/hint.png"
                })
            } else {
                for (i = 0, length = this.data.chosenItems.length; i < length; i++) {
                    attributes.push(this.getSku(this.data.chosenItems[i]));
                }
                _cart.push({
                    stock_no: this.data.chosenSkuId,
                    name: this.data.product.name,
                    type: this.data.product.type,
                    unit: this.data.price,
                    amount: this.data.amount,
                    attributes: attributes,
                    thumbnails: this.data.product.thumbnails
                });

                wx.navigateTo({
                    url: '/pages/shopping/buy/buy?cart=' + JSON.stringify(_cart)
                })
            }
        }
    },

    /**
     *   选择规格参数
     */
    bindTapChooseItem: function(e) {
        this.selectSKU(e.currentTarget.dataset.attribute, e.currentTarget.dataset.valueid);
    },

    /**
     * 	 减少购买数量
     */
    bindTapMinus: function() {
        if (this.data.amount > 1) {
            this.data.amount--;
            this.setData({
                amount: this.data.amount
            });
        }
    },

    /**
     * 	增加购买数量 
     */
    bindTapAdd: function() {
        if (this.data.amount < this.data.remaining) {
            this.data.amount++;
            this.setData({
                amount: this.data.amount
            });
        }
    },

    /**
     *  领取卡券
     */
    bindTapCardHolder: function(evt) {
        if (this.data.history.length > 0) {
            let that = this;

            __SHOPPING__
                .putIntoCardHolder( //	放入微信卡包
                    wx.getStorageSync('__SESSION_KEY__'), //  用户 session
                    this.data.product.pid,
                    this.data.history[0]
                )
                .then(result => {
                    console.log(result);
                    //领取成功后
                    if (result.errMsg === 'addCard:ok' &&
                        result.cardList.length > 0 &&
                        result.cardList[0].isSuccess) {
                        let cardExt = JSON.parse(result.cardList[0].cardExt);
                        //记录用户领取记录
                        __SHOPPING__
                            .recordUserCard(
                                wx.getStorageSync('__SESSION_KEY__'), //	SESSION
                                result.cardList[0].cardId, //卡券ID
                                cardExt.openid, //用户
                                cardExt.timestamp, //创建时间戳
                                that.data.history[0], //交易ID
                                result.cardList[0].code) //卡券CODE
                            .then(res => {
                                console.log(res);
                                wx.showToast({
                                    title: '成功领取'
                                });
                            });
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }
    },

    /**
     *  出示卡券
     *  跳转至微信卡券列表
     */
    bindTapShowCards: function() {
        if (this.data.history.length > 0) {
            __SHOPPING__
                .openUserCardList(
                    wx.getStorageSync('__SESSION_KEY__'),
                    JSON.stringify(this.data.history)
                )
                .then(res => {
                    console.log(res);
                })
        }
    },

    /**
     *   判断是否已选择全部参数
     */
    isHit: function() {
        let i, count, currentStandards;

        //  如果已选参数数组长度不足，直接返回 -1
        if (this.data.chosenItems.length === this.data.product.standards.length) {
            currentStandards = this.data.chosenItems.sort().join(',');
            //  遍历sku数组，找到对应参数的 SKU
            for (i = 0, count = this.data.product.sku.length; i < count; i++) {
                if (currentStandards === this.data.product.sku[i].attributes.split(',').filter(char => {
                        return char !== '';
                    }).sort().join(',')) {
                    return i; // 返回sku数组的索引值 
                }
            }
        }
        return -1;
    },

    /**
     *  选中SKU
     */
    selectSKU: function(currentChosenAttribute, currentChosenValueId) {
        let i, j, count, length, vid, index;

        // 遍历standards数组
        for (i = 0, count = this.data.product.standards.length; i < count; i++) {
            // 判断是否等于当前的attribute
            if (this.data.product.standards[i].attribute === currentChosenAttribute) {
                for (j = 0, length = this.data.product.standards[i].collections.length; j < length; j++) {
                    // 遍历已选择的元素数组 chosenItems 
                    index = this.data.chosenItems.indexOf(this.data.product.standards[i].collections[j].skuValueId);
                    // 判断是否等于当前的 valueId
                    if (currentChosenValueId === this.data.product.standards[i].collections[j].skuValueId) {
                        this.data.product.standards[i].collections[j].enable = true;
                        // 判断是否已在数组 chosenItems
                        if (index === -1) {
                            this.data.chosenItems.push(this.data.product.standards[i].collections[j].skuValueId)
                        }
                    } else {
                        // 判断其之前是否已选中
                        if (this.data.product.standards[i].collections[j].enable) {
                            this.data.product.standards[i].collections[j].enable = false;
                            if (index > -1) {
                                this.data.chosenItems.splice(index, 1);
                            }
                        }
                    }
                }
                break;
            }
        } /** end of for */
        index = this.isHit();
        if (index === -1) {
            this.setData({
                product: this.data.product
            });
        } else {
            // 命中
            // 设置为对应的SKU参数
            this.setData({
                isReady: true,
                amount: 1, //  初始化购买数量 
                product: this.data.product, //  选中的规格底色发生变化 
                chosenSkuId: this.data.product.sku[index].stock_no, //  stock_no
                price: this.data.product.sku[index].unit, //  单价
                remaining: this.data.product.sku[index].stock //  库存
            })
        }
    },

    /**
     *   获取SKU的属性名及属性值
     */
    getSku: function(skuValueId) {
        var i,
            j,
            count,
            length;

        for (i = 0, count = this.data.product.standards.length; i < count; i++) {
            for (j = 0, length = this.data.product.standards[i].collections.length; j < length; j++) {
                if (skuValueId === this.data.product.standards[i].collections[j].skuValueId) {
                    return this.data.product.standards[i].attribute + ": " + this.data.product.standards[i].collections[j].value;
                }
            }
        }
        return "";
    },

    /**
     *  如果商品为卡券类
     *  判断用户是否之前已购买过
     *  如果已购买，显示打开卡包
     */
    everBougth: function() {
        let that = this;

        if (this.data.product.type === 1) {
            __SHOPPING__
                .queryEverBought(
                    wx.getStorageSync('__SESSION_KEY__'),
                    this.data.product.sku[0].stock_no
                )
                .then(res => {
                    console.log(res);
                    //	设置属性为已购买
                    if (res.data.code === 0) {
                        let records = res.data.msg.order.map(item => {
                            return item.out_trade_no;
                        })
                        that.setData({
                            showCardButton: true,
                            history: records,
                            cards: res.data.msg.card
                        });
                    } else {
                        that.setData({
                            showCardButton: true
                        });
                    }
                });
        }
    },

    everBoughtWrapper: function() {
        if (this.data.isReady) {
            this.everBougth();
        } else {
            setTimeout(() => {
                this.everBoughtWrapper();
            }, 1000);
        }
    },

    /**
     * 	播放视频
     */
    onPlayVideo: function(evt) {
        this.setData({
            videoUrl: evt.currentTarget.dataset.url,
            isHidden: false
        })
        this.videoContext.play();
    },

    /**
     * 	退出播放
     */
    onCloseVideo: function() {
        this.videoContext.pause();
        this.setData({
            isHidden: true
        });
    }
})