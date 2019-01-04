// pages/shop/shop.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 私有数据
     */
    bid: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.bid = options.bid;
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
     * 进入产品列表页
     */
    onTapProduct: function() {
        wx.navigateTo({
            url: '/pages/product/product?bid=' + this.bid
        });
    },

    /**
     * 进入订单列表页
     */
    onTapOrder: function() {
        wx.navigateTo({
            url: '/pages/order/order?bid=' + this.bid
        });
    },

    /**
     * 进入资金流水页
     */
    onTapBill: function() {
        wx.navigateTo({
            url: '/pages/bill/bill?bid=' + this.bid
        });
    },

    /**
     * 进入我的资产页
     */
    onTapCapital: function() {
        wx.navigateTo({
            url: '/pages/capital/capital?bid=' + this.bid
        });
    }
})