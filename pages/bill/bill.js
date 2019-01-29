// pages/bill/bill.js
const __BACKBONE__ = require('../../services/backbone.service.js');
const __MAX_ITEMS_PER_TIME__ = 5;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        collections: []
    },

    /**
     * 私有数据
     */
    currentOffset: 0,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getBills();
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
     * 获取账单流水
     */
    getBills: function() {
        const that = this;

        __BACKBONE__
            .getBillList({
                offset: this.currentOffset,
                amount: __MAX_ITEMS_PER_TIME__
            })
            .then(res => {
                console.log(res);
                if (res.data.code === 0 && res.data.data.bills.length > 0) {
                    let bills = res.data.data.bills.map(item => {
                        item.billType = __BACKBONE__.__ENUM_BILL_TYPE__[item.billType];
                        item.status = __BACKBONE__.__ENUM_BILL_STATUS__[item.status];
                        item.amount = (item.amount / 100).toFixed(2);
                        item.fee = (item.fee / 100).toFixed(2);
                        return item;
                    });
                    that.currentOffset += bills.length;
                    that.setData({
                        collections: bills
                    })
                }
            });
    }
})