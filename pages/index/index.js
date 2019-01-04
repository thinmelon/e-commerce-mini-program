// pages/index/index.js
const __CRYPT__ = require('../../utils/crypt.js');
const __PROMISIFY__ = require('../../utils/promisify.js');
const __USER__ = require('../../services/user.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
     * 获取 用户信息
     */
    onGetUserInfo: function(res) {
        console.log(res.detail);
        const userInfo = res.detail.userInfo; //	暂存用户的微信账号信息

        __PROMISIFY__
            .showLoading({ //  开始，显示加载框
                title: '登录中...',
                mask: true
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    resolve({
                        session: encodeURIComponent(__CRYPT__.encryptData('')),
                        userInfo: JSON.stringify(res.detail)
                    })
                });
            })
            .then(__USER__.saveUserInfo)
            .then(info => {
                console.log(info);
                return new Promise((resolve, reject) => {
                    if (info.data.hasOwnProperty('code') && info.data.code === 0) {
                        wx.setStorageSync('__USER_INFO__', userInfo); //  如果验签通过，则保存用户的微信账号信息至本地存储
                        resolve({
                            session: encodeURIComponent(__CRYPT__.encryptData(''))
                        });
                    } else {
                        reject('验证数据有效性发生错误');
                    }
                });
            })
            .then(__USER__.switchIdentity) //  切换至管理员身份
            .then(identity => {
                console.log(identity);
                return new Promise((resolve, reject) => {
                    if (identity.data.hasOwnProperty('code') && identity.data.code === 0) {
                        let keyInfo = wx.getStorageSync('__KEY__'); //  更新SESSION
                        resolve({
                            key: '__KEY__',
                            data: {
                                session: identity.data.data.session,
                                publicKey: keyInfo.publicKey,
                                duration: keyInfo.duration
                            }
                        });
                    } else {
                        reject('发生错误');
                    }
                });
            })
            .then(__PROMISIFY__.setStorage) //  保存至本地存储
            .then(() => {
                wx.reLaunch({
                    url: '/pages/entry/entry'
                })
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                __PROMISIFY__.hideLoading();
            });
    }
})