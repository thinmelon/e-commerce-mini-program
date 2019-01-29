// pages/order/order.js
const __BACKBONE__ = require('../../services/backbone.service.js');
const __MAX_ITEMS_PER_TIME__ = 5;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },

    businessId: '',
    currentOffset: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.businessId = options.bid;
        this.getOrders(this.businessId);
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
        this.getOrders(this.businessId);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    getOrders: function(businessId) {
        let orders = [];
        const that = this;

        __BACKBONE__
            .getOrderList({ //	获取当前用户授权的小程序列表
                businessId: businessId, //  商家ID
                offset: this.currentOffset, //  偏移量
                amount: __MAX_ITEMS_PER_TIME__ //  每次拉取的订单数
            }).then(res => {
                console.log(res)
                if (res.data.code === 0) {
                    res.data.data.order.map(order => {
                        let skuList = [];
                        for (let key in order.sku) {
                            for (let i = 0, length = res.data.data.product.length; i < length; i++) {
                                let isHit = false,
                                    attributes = [],
                                    unit;

                                res.data.data.product[i].sku.map(item => {
                                    if (item._id === order.sku[key].stock_no) {
                                        isHit = true;
                                        for (let param in item) {
                                            if (param !== '_id' && param !== 'unit' && param !== 'amount') {
                                                attributes.push({
                                                    name: param,
                                                    value: item[param]
                                                });
                                            }
                                        }
                                        unit = item.unit;
                                    }
                                })
                                if (isHit) {
                                    skuList.push({
                                        "pid": res.data.data.product[i]._id,
                                        "stock_no": order.sku[key].stock_no,
                                        "name": decodeURIComponent(res.data.data.product[i].name),
                                        "unit": unit,
                                        "amount": order.sku[key].amount,
                                        "attributes": attributes,
                                        "thumbnail": res.data.data.product[i].thumbnails[0].url,
                                        "type": res.data.data.product[i].type
                                    });
                                }
                            } /** end of for */
                        } /** end of for */
                        orders.push({
                            out_trade_no: order._id, //  订单编号
                            createTime: order.createTime, //	创建时间
                            completeTime: order.completeTime, //	创建时间
                            status: __BACKBONE__.__ENUM_ORDER_STATUS__[order.status], //  找到状态值相应的文字描述
                            //  订单总金额，保留小数点后两位，单位：元
                            totalFee: (order.totalFee / 100).toFixed(2),
                            consignee: order.consignee,
                            skuList: skuList //  SKU列表
                        });
                    });
                    if (orders.length > 0) {
                        that.currentOffset += orders.length;
                        that.data.orderList = that.data.orderList.concat(orders);

                        that.setData({
                            orderList: that.data.orderList
                        });
                    }
                }
            }).catch(err => {
                console.error(err)
            })


    },

    bindTapOrderDetail: function(e) {
        wx.navigateTo({
            url: '/pages/shopping/order/order?order=' + JSON.stringify(e.currentTarget.dataset.order)
        })
    }
})