// pages/shopping/cart/cart.js
const __URI__ = require('../../../utils/uri.constant.js');
const __PRICE__ = require('../../../utils/math.price.js');
const __USER__ = require('../../../services/credential.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hint: "购物车空空也~ ~",
        editBtnText: "编辑",
        subtotal: 0.00,
        cart: Array,
        selectAll: false,
        editModal: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.fetchMyCartWrapper();
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
        if (getApp().isLogIn) {
            this.fetchMyCart();
        }
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

    fetchMyCartWrapper: function() {
        if (getApp().isLogIn) {
            this.fetchMyCart();
        } else {
            setTimeout(() => {
                this.fetchMyCartWrapper();
            }, 1000);
        }
    },

    fetchMyCart: function() {
        let that = this,
            cart = [];

        __USER__
            .fetchMyCart(wx.getStorageSync('__SESSION_KEY__'))
            .then(res => {
                console.log(res.data)
                if (res.data.code === 0) {
                    for (let key in res.data.msg.cart) {
                        let attributes = [],
                            /** SKU相应的属性值ID 将字符串分隔为数组 */
                            tmpArray = res.data.msg.cart[key].attributes.split(',');
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
                                return thumbnail.productid === res.data.msg.cart[key].pid;
                            })
                            .map(image => {
                                return {
                                    name: __URI__.imageUrlPrefix(image.name)
                                };
                            });

                        cart.push({
                            "stock_no": res.data.msg.cart[key].stock_no,
                            "name": decodeURIComponent(res.data.msg.cart[key].name),
                            "unit": res.data.msg.cart[key].unit,
                            "amount": res.data.msg.cart[key].amount,
                            "attributes": attributes,
                            "thumbnails": thumbnails
                        });
                    } /** end of for */
                    if (cart.length > 0) {
                        that.setData({
                            hint: "", //  提示
                            subtotal: __PRICE__.checkedPrice(cart), //  计算总金额
                            cart: cart //  购物车
                        });
                    } /** end of if */
                } /** end of if */
            })
    },

    /**
     *   结算
     */
    bindTapSettleAccount: function() {
        var i,
            length,
            final = [];

        for (i = 0, length = this.data.cart.length; i < length; i++) {
            if (this.data.cart[i].checked) {
                final.push(this.data.cart[i]);
            }
        }

        if (final.length > 0) {
            // TODO:  跳转至 待付款订单 页面
            wx.navigateTo({
                url: '/pages/shopping/buy/buy?cart=' + JSON.stringify(final)
            })
        } else {
            wx.showToast({
                title: '选择要买的商品',
                image: "/icons/public/hint.png",
                duration: 3000
            })
        }
    },

    /**
     *   编辑
     */
    bindTapEdit: function(e) {
        this.data.editModal = !this.data.editModal;
        if (this.data.editModal) {
            this.data.editBtnText = '完成'
        } else {
            if (this.data.cart.length > 0) {
                __USER__
                    .updateMyCart(
                        wx.getStorageSync('__SESSION_KEY__'),
                        JSON.stringify(this.data.cart)
                    )
                    .then((res) => {
                        console.log(res);
                    });
            }
            this.data.editBtnText = '编辑'
        }
        this.setData({
            editBtnText: this.data.editBtnText,
            editModal: this.data.editModal
        })
    },

    /**
     *   删除
     */
    bindTapDelete: function(e) {
        let that = this;

        // 弹出确认的模式对话框
        wx.showModal({
            title: '请再次确认是否删除？',
            content: '',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    __USER__
                        .removeMyCart(
                            wx.getStorageSync('__SESSION_KEY__'),
                            e.currentTarget.dataset.stock_no)
                        .then((res) => {
                            // 调用从购物车删除商品接口，检验返回结果
                            console.log(res);
                            if (res.data.code === 0) {
                                // 删除成功后，找到该商品在购物车列表中的索引
                                var index = that.getIndex(that.data.cart, e.currentTarget.dataset.stock_no);
                                if (index > -1) {
                                    // 更新本地数据
                                    that.data.cart.splice(index, 1);
                                    that.setData({
                                        subtotal: __PRICE__.checkedPrice(that.data.cart),
                                        cart: that.data.cart
                                    })
                                }
                            }
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })


    },

    getIndex: function(cart, id) {
        var i,
            length;

        for (i = 0, length = cart.length; i < length; i++) {
            if (cart[i].stock_no === id) {
                return i;
            }
        }
        return -1;
    },

    /**
     *   单选
     */
    cartCheckboxChange: function(e) {
        var i,
            j,
            length,
            count;

        for (i = 0, length = this.data.cart.length; i < length; i++) {
            this.data.cart[i].checked = false;
            for (j = 0, count = e.detail.value.length; j < count; j++) {
                if (this.data.cart[i].stock_no === e.detail.value[j]) {
                    this.data.cart[i].checked = true;
                    break;
                }
            }
        }

        this.setData({
            cart: this.data.cart,
            subtotal: __PRICE__.checkedPrice(this.data.cart)
        });
    },

    /**
     *   全选 
     */
    selectAllCheckboxChange: function(e) {
        var i, length;

        this.data.selectAll = !this.data.selectAll;
        for (i = 0, length = this.data.cart.length; i < length; i++) {
            this.data.cart[i].checked = this.data.selectAll;
        }
        this.setData({
            cart: this.data.cart,
            subtotal: __PRICE__.checkedPrice(this.data.cart),
            selectAll: this.data.selectAll
        })
    },

    /**
     * 减少数量
     */
    bindTapMinus: function(e) {
        this.data.cart = this.data.cart.map(product => {
            if (product.stock_no === e.currentTarget.dataset.product.stock_no &&
                product.amount > 1)
                product.amount--;
            return product;
        });
        this.setData({
            cart: this.data.cart
        });
    },

    /**
     * 增加数量
     */
    bindTapAdd: function(e) {
        this.data.cart = this.data.cart.map(product => {
            if (product.stock_no === e.currentTarget.dataset.product.stock_no)
                product.amount++;
            return product;
        });
        this.setData({
            cart: this.data.cart
        });
    },

    /**
     *  直接输入
     */
    bindInputFunc: function(e) {
        this.data.cart = this.data.cart.map(product => {
            if (product.stock_no === e.currentTarget.dataset.stock_no)
                product.amount = parseInt(e.detail.value);
            return product;
        });
        this.setData({
            cart: this.data.cart
        });

    }
})