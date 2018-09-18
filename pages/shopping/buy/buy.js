// pages/shopping/buy/buy.js

const __PRICE__ = require('../../../utils/math.price.js');
const __USER__ = require('../../../services/credential.service.js');
const __SHOPPING__ = require('../../../services/wechat.pay.service.js');
const __WX_API_PROMISE__ = require('../../../utils/wx.api.promise.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cart: [],
        subtotal: 0.00,
        carriage: 0.00,
        total: 0.00,
        message: '',
        isConsigneeShow: true,
        consignee: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let
            index,
            length,
            subtotal = 0,
            total = 0,
            isConsigneeShow = false;

        this.data.cart = JSON.parse(options.cart);
        console.log(this.data.cart);
        // 判断是否需要显示收件人（虚拟物品无需收货）
        for (index = 0, length = this.data.cart.length; index < length; index++) {
            if (this.data.cart[index].type === 0) {
                isConsigneeShow = true;
                break;
            }
        }
        if (this.data.isConsigneeShow) {
            const that = this;
            //	如果是实物，则获取用户的地址信息
            __USER__.
            fetchDefaultConsignee(wx.getStorageSync('__SESSION_KEY__'))
                .then(res => {
                    console.log('=======    fetchDefaultConsignee    =======')
                    console.log(res.data)
                    if (0 === res.data.code && res.data.msg.length > 0) {
                        that.setData({
                            consignee: res.data.msg[0]
                        })
                    }
                });
        }
        // 小计
        this.data.subtotal = __PRICE__.totalPrice(this.data.cart);
        // 总金额（包含运费）
        this.data.total = Math.round((this.data.subtotal + this.data.carriage) * 100) / 100;

        this.setData({
            cart: this.data.cart,
            isConsigneeShow: isConsigneeShow,
            subtotal: this.data.subtotal,
            total: this.data.total
        });
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

    /**
     *  添加 收件人地址
     */
    bindTapDeliveryAddress: function() {
        wx.navigateTo({
            url: '/pages/my/consignee/consignee'
        })
    },

    /**
     *   记录用户留言
     */
    bindInputFunc: function(e) {
        this.data.message = e.detail.value;
    },

    /**
     *   提交订单
     *     --  微信支付
     */
    bindTapSubmitOrder: function() {
        console.log(this.data.isConsigneeShow);
        if (this.data.isConsigneeShow && !this.data.consignee) {
            //	提示
            __WX_API_PROMISE__
                .showToast('收件地址未设置', 'none', '/icons/public/hint.png')
            return;
        }

        //  构建传入参数
        //  --   body
        //  --   sku列表
        var that = this,
            body = '',
            sku_list = [],
            out_trade_no;

        for (var key in this.data.cart) {
            body += this.data.cart[key].name + ' | ';
            sku_list[key] = {
                stock_no: this.data.cart[key].stock_no,
                amount: this.data.cart[key].amount
            }
        }

        __SHOPPING__
            .submitUnifiedOrder({
                body: body.substr(0, 32), //  商品描述，最大长度128
                attach: this.data.message, //  用户留言
                total_fee: Math.round(this.data.total * 100), //  总金额
                session: wx.getStorageSync('__SESSION_KEY__'), //  用户 session
                consignee_no: this.data.consignee.consignee_no, //  地址
                sku_list: JSON.stringify(sku_list) //  SKU 列表 
            })
            .then(result => {
                console.log(result);
                out_trade_no = result.data.out_trade_no;
                return new Promise((resolve, reject) => {
                    resolve(result);
                })
            })
            .then(__WX_API_PROMISE__.requestPayment) //  调用支付接口
            .then(res => {
                // 支付成功
                if (res.errMsg === 'requestPayment:ok') {
                    __WX_API_PROMISE__
                        .showToast('支付成功', 'success', '') //  提示
                        .then(() => {
                            var order = {
                                out_trade_no: out_trade_no,
                                skuList: that.data.cart
                            }
                            __WX_API_PROMISE__
                                .redirectTo('/pages/shopping/order/order?order=' + JSON.stringify(order)) //	跳转至 订单详情
                        });
                }
            }, res => {
                // 用户取消支付
                if (res.errMsg === "requestPayment:fail cancel") {
                    __WX_API_PROMISE__
                        .showToast('支付已取消', 'none', '/icons/public/hint.png') //	提示
                        .then(() => __WX_API_PROMISE__.redirectTo('/pages/my/orders/orders')) //	跳转至 我的订单
                }
            })
            .finally(result => {
                __USER__
                    .renewMyCart(wx.getStorageSync('__SESSION_KEY__'), JSON.stringify(sku_list))
                    .then((res) => {
                        console.log(res)
                    });
            });
    }
})