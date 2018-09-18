// pages/shopping/refund-reason/refund-reason.js
const __USER_SERVICE__ = require('../../../services/credential.service.js');
const __WX_API_PROMISE__ = require('../../../utils/wx.api.promise.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		order: {},
		reasons: [],
		reason: '',
		others: ''
	},

	/**
	 * 生命周期函数	--	监听页面加载
	 */
	onLoad: function (options) {
		console.log(options);
		this.setData({
			order: JSON.parse(options.order),
			reasons: [
				'拍错了，不是我想要的。。。',
				'怎么回事，质量有问题！！！',
				'其它'
			]
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

	},

	/**
	 * 单选项
	 */
	radioChange: function (evt) {
		this.data.reason = evt.detail.value;
	},

	/**
	 * 取文本框内内容
	 */
	bindTextAreaInput: function (evt) {
		this.data.others = evt.detail.value;
	},

	/**
	 * 申请退款
	 */
	bindTapRefund: function () {
		let reason;

		if (this.data.reason === '') {
			wx.showToast({
				title: '请选择退款原因',
				icon: 'none',
				image: '/icons/public/hint.png'
			})
			return;
		}
		//	记录其它原因
		if (this.data.reason === '其它') {
			reason = this.data.others;
		} else {
			reason = this.data.reason;
		}

		let i, length, skuList = [];

		for (i = 0, length = this.data.order.skuList.length; i < length; i++) {
			skuList.push(this.data.order.skuList[i].stock_no);
		}

		__USER_SERVICE__
			.submitRefund(
			wx.getStorageSync('__SESSION_KEY__'),      //  用户 session
			this.data.order.out_trade_no,
			Math.round(this.data.order.totalFee * 100),
			Math.round(this.data.order.totalFee * 100),
			reason,
			JSON.stringify(skuList))
			.then(res => {
				console.log(res);
				if (res.data.code === 0) {
					__WX_API_PROMISE__
						.showToast('已申请退款', 'success', '')   //  提示
						.then(() => __WX_API_PROMISE__.redirectTo('/pages/my/orders/orders'))	//	跳转至 我的订单
				} else if (res.data.code === -500) {
					__WX_API_PROMISE__
						.showToast('已提交，请等待', 'none', '/icons/public/hint.png')		//	提示
						.then(() => __WX_API_PROMISE__.redirectTo('/pages/my/orders/orders'))	//	跳转至 我的订单
				}
			})
	}
})