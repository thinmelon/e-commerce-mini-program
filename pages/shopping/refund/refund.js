// pages/shopping/refund/refund.js
const __WX_PAY_SERVICE__ = require('../../../services/wechat.pay.service.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		order: {},
		refund: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this;
		this.data.order = JSON.parse(options.order);

		__WX_PAY_SERVICE__
			.queryRefundInfo(																		//  发起重新支付的动作
				wx.getStorageSync('__SESSION_KEY__'),      				//  用户 session
				this.data.order.out_trade_no
			)
			.then(res => {
				console.log(res);
				if (res.data.code === 0) {
					that.setData({
						order: that.data.order,
						refund: res.data.msg[0]
					});
				}
			});
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})