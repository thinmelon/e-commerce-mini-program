// pages/my/orders/orders.js
const __URI__ = require('../../../utils/uri.constant.js');
const __DATE__ = require('../../../utils/date.formatter.js');
const __USER__ = require('../../../services/credential.service.js');
const __WX_PAY_SERVICE__ = require('../../../services/wechat.pay.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.fetchMyOrdersWrapper();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

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
    onShareAppMessage: function() {

    },

    fetchMyOrdersWrapper: function() {
        if (getApp().isLogIn) {
            this.fetchMyOrders();
        } else {
            setTimeout(() => {
                this.fetchMyOrdersWrapper();
            }, 1000);
        }
    },

    fetchMyOrders: function() {
        let orders = [],
            that = this;

        __USER__
            .fetchMyOrders(
                wx.getStorageSync('__SESSION_KEY__'), __DATE__.formatTime(new Date()))
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    for (let key in res.data.msg.order) {
                        let attributes = [],
                            /** SKU相应的属性值ID 将字符串分隔为数组 */
                            tmpArray = res.data.msg.order[key].attributes.split(',');

                        /** 转换为属性值名称 */
                        for (let i = 0; i < tmpArray.length; i++) {
                            for (let j = 0; j < res.data.msg.sku.length; j++) {
                                if (parseInt(tmpArray[i]) === res.data.msg.sku[j].vid) {
                                    attributes.push(res.data.msg.sku[j].name + ": " + res.data.msg.sku[j].value);
                                    break;
                                }
                            } /** end of for */
                        } /** end of for */

                        let thumbnails = res.data.msg.thumbnails.filter(thumbnail => {
                                return thumbnail.productid === res.data.msg.order[key].pid;
                            })
                            .map(image => {
                                return {
                                    name: __URI__.imageUrlPrefix(image.name)
                                };
                            });

                        let sku = {
                            name: decodeURIComponent(res.data.msg.order[key].name), //	商品名称
                            stock_no: res.data.msg.order[key].stock_no, //	SKU ID
                            unit: res.data.msg.order[key].unit, //	SKU 单价
                            attributes: attributes, //	SKU 属性值 
                            amount: res.data.msg.order[key].amount, //	购买数量
                            thumbnails: thumbnails
                        };

                        if (0 === orders.filter((item) => item.out_trade_no === res.data.msg.order[key].out_trade_no).length) {
                            orders.push({
                                //  订单编号
                                out_trade_no: res.data.msg.order[key].out_trade_no,
                                //	创建时间
                                createTime: res.data.msg.order[key].createTime,
                                //  找到状态值相应的文字描述
                                status: __WX_PAY_SERVICE__.__ENUM_ORDER_STATUS__[res.data.msg.order[key].status],
                                //  订单总金额，保留小数点后两位，单位：元
                                totalFee: (res.data.msg.order[key].totalFee / 100).toFixed(2),
                                //  SKU列表
                                skuList: [sku]
                            });
                        } else {
                            orders = orders.map((item) => {
                                if (item.out_trade_no === res.data.msg.order[key].out_trade_no) {
                                    item.skuList.push(sku)
                                }
                                return item;
                            });
                        }
                    }

                    if (orders.length > 0) {
                        that.setData({
                            orderList: orders
                        });
                    }

                } /** end of if */

            });
    },

    bindTapOrderDetail: function(e) {
        wx.navigateTo({
            url: '/pages/shopping/order/order?order=' + JSON.stringify(e.currentTarget.dataset.order)
        })
    }
})