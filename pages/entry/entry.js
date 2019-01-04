// pages/entry/entry.js
const __PROMISIFY__ = require('../../utils/promisify.js');
const __BACKBONE__ = require('../../services/backbone.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        authorizerList: [],
        businessList: [],
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const userInfo = wx.getStorageSync('__USER_INFO__'); //	从本地存储获取用户的微信账号信息
        this.setData({
            userInfo: userInfo
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
        const that = this;
        __BACKBONE__
            .getAuthorizerList({ //	获取当前用户授权的小程序列表
                type: 1 //	小程序
            }).then(list => {
                console.log(list);
                if (list.data.code === 0 && list.data.authorizerList.length > 0) {
                    that.setData({
                        authorizerList: list.data.authorizerList
                    });
                    that.showBusinessList(list.data.authorizerList[0].appid);
                }
            }).catch(err => {
                console.error(err)
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
    onShareAppMessage: function() {

    },

    /**
     * 选择授权的小程序
     */
    onChangeAuthorizer: function(evt) {
        const appid = this.data.authorizerList[evt.detail.value[0]].appid; //选中的授权方appid
        this.showBusinessList(appid);
    },

    /**
     * 显示当前授权方的店铺列表
     */
    showBusinessList: function(appid) {
        const that = this;

        __BACKBONE__
            .getBusinessList({ //	获取当前用户授权的小程序列表
                appid: appid
            }).then(list => {
                console.log(list)
                if (list.data.code === 0) {
                    that.setData({
                        businessList: list.data.data
                    });
                }
            }).catch(err => {
                console.error(err)
            })
    },

    /**
     * 进入店铺
     */
    onTapBusiness: function(evt) {
        const business = evt.currentTarget.dataset.business; //选中的授权方
        console.log(business);
        __PROMISIFY__.setStorage({
            key: '__MY_BUSINESS__',
            data: business
        }).then(() => {
            wx.navigateTo({
                url: '/pages/shop/shop?bid=' + business._id
            });
        }).catch(err => {
            console.error(err)
        })
    }

})