// pages/product/product.js
const __BACKBONE__ = require('../../services/backbone.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        productList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;

        __BACKBONE__
            .getProductList({ //	获取当前用户授权的小程序列表
                businessId: options.bid,
                offset: 0,
                amount: 5
            }).then(list => {
                console.log(list)
                if (list.data.code === 0 && list.data.data.length > 0) {
					that.setData({
                        productList: list.data.data.map(item => {
                            item.name = decodeURIComponent(item.name);
                            return item;
                        })
                    })
                }
            }).catch(err => {
                console.error(err)
            })
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

    }
})