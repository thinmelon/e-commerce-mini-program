// pages/my/consignee/consignee.js
const __USER__ = require('../../../services/credential.service.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        consignees: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.fetchMyConsigneeWrapper();
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

    fetchMyConsigneeWrapper: function() {
        if (getApp().isLogIn) {
            this.fetchMyConsignee();
        } else {
            setTimeout(() => {
                this.fetchMyConsigneeWrapper();
            }, 1000);
        }
    },

    fetchMyConsignee: function() {
        const that = this;

        __USER__
            .fetchMyConsignee(wx.getStorageSync('__SESSION_KEY__'))
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    that.setData({
                        consignees: res.data.msg
                    })
                }
            });
    },

    bindTapAdd: function(e) {
        console.info(e);
        wx.navigateTo({
            url: '/pages/my/address/address'
        });
    },

    bindTapEdit: function(e) {
        wx.navigateTo({
            url: '/pages/my/address/address?consignee_no=' + e.currentTarget.id +
                '&name=' + e.currentTarget.dataset.name +
                '&mobile=' + e.currentTarget.dataset.mobile +
                '&address=' + e.currentTarget.dataset.address +
                '&postcode=' + e.currentTarget.dataset.postcode
        });
    },

    bindTapDelete: function() {

    },

    radioChange: function(e) {
        const that = this;

        __USER__.
        setAsDefaultConsignee(
                wx.getStorageSync('__SESSION_KEY__'),
                e.detail.value
            )
            .then(() => {
                wx.navigateBack();
            });
    }

})