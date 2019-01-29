// pages/product/index/index.js
const __BACKBONE__ = require('../../../services/backbone.service.js');
const __MAX_ITEMS_PER_TIME__ = 8;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        collections: []
    },

    businessId: '',
    currentOffset: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.businessId = options.bid;
        this.getProducts(this.businessId);
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
        this.getProducts(this.businessId);
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**
     * 获取商品列表
     */
    getProducts: function(businessId) {
        const that = this;

        __BACKBONE__
            .getProductList({ //	获取当前用户授权的小程序列表
                businessId: businessId,
                offset: this.currentOffset,
                amount: __MAX_ITEMS_PER_TIME__
            }).then(res => {
                if (res.data.code === 0) {
                    let products = res.data.data.products.map(item => {
                        item.name = decodeURIComponent(item.name);
                        return item;
                    })
                    if (products.length > 0) {
                        this.currentOffset += products.length;
                        this.data.collections = this.data.collections.concat(products);
                        that.setData({
                            collections: this.data.collections
                        })
                    }
                }
            }).catch(err => {
                console.error(err)
            })
    },

    /**
     * 按键 添加商品 事件处理 
     */
    onTapNewProduct: function() {
        wx.navigateTo({
            url: '/pages/product/new/new?bid=' + this.businessId
        })


    }
})