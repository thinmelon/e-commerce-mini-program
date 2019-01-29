// pages/capital/capital.js
const __USER__ = require('../../services/user.service.js');
const __BACKBONE__ = require('../../services/backbone.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        amount: '',
        available: '',
        bankNo: '',
        name: '',
        cash: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        //  获取我的资产信息（账户余额及可提取金额）
        __USER__
            .getMyCapital().then(info => {
                console.log(info)
                if (info.data.code === 0) {
                    that.setData({
                        amount: info.data.data.capital.amount ? (info.data.data.capital.amount / 100).toFixed(2) : '0',
                        available: info.data.data.capital.available ? (info.data.data.capital.available / 100).toFixed(2) : '0'
                    });
                }
            }).catch(err => {
                console.error(err)
            });


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        const that = this;

        // 获取管理员的手机号码，如果未绑定的话，不可申请提现
        __BACKBONE__
            .getMyBankCard().then(bank => {
                console.log(bank)
                if (bank.data.code === 0) {
                    bank.data.data.map(item => {
                        if (item.default === 1) { //  找到缺省银行卡
                            that.data.bankNo = item.originalBankNo;
                            that.data.name = item.originalName;
                        }
                    });
                    if (bank.data.options.hasOwnProperty('mobile') && bank.data.options.mobile) {
                        that.data.phone = bank.data.options.mobile; //  设置手机号码
                    }
                    that.setData({
                        bankNo: that.data.bankNo,
                        name: that.data.name,
                        phone: that.data.phone
                    });
                }
            }).catch(err => {
                console.error(err);
            })
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

    onInputCash: function(e) {
        this.data.cash = e.detail.value;
    },

    onCompleteCode: function(e) {
        console.log(e);
        __BACKBONE__.withdrawCash({
                appid: wx.getStorageSync('__AUTHORIZER_APPID__'),
                requestId: e.detail.requestId,
                bizId: e.detail.bizId,
                phone: e.detail.phone,
                verificationCode: e.detail.code,
                withdraw: this.data.cash
            })
            .then(res => {
                console.log(res);
                if (res.data.code === 0) {
                    wx.showToast({
                        title: '成功提现',
                        icon: 'success',
                        duration: 3000
                    })
                } else if (res.data.code === -300) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 3000
                    })
                } else {
                    wx.showToast({
                        title: res.data,
                        icon: 'none',
                        duration: 3000
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
})