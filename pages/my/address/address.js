// pages/my/address/address.js
const __USER__ = require('../../../services/credential.service.js');
const __WX_API_PROMISE__ = require('../../../utils/wx.api.promise.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		consignee_no: '',
		receiver: "",
		mobile: "",
		address: "",
		postcode: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		console.info(options);

		this.setData({
			consignee_no: options.consignee_no || this.data.consignee_no,
			receiver: options.name || this.data.receiver,
			mobile: options.mobile || this.data.mobile,
			address: options.address || this.data.address,
			postcode: options.postcode || this.data.postcode
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

	bindTapChooseLocation: function () {
		var that = this;
		wx.chooseLocation({
			success: function (res) {
				console.info(res);
				that.setData({
					address: res.address
				});
			}
		});
	},

	bindTapSubmit: function () {
		const that = this;
		const session = wx.getStorageSync('__SESSION_KEY__');
		console.log(this.data.consignee_no);
		if (this.data.consignee_no === '') {
			__USER__.
				addNewConsignee(session, this.data.receiver, this.data.mobile, this.data.address, this.data.postcode)
				.then(() => { wx.navigateBack(); });
		} else {
			__USER__.
				editConsignee(session, this.data.consignee_no, this.data.receiver, this.data.mobile, this.data.address, this.data.postcode)
				.then(() => { wx.navigateBack(); });
		}
	},

	bindInputFunc: function (e) {
		switch (e.currentTarget.dataset.field) {
			case "receiver":
				this.data.receiver = e.detail.value;
				break;
			case "mobile":
				this.data.mobile = e.detail.value;
				break;
			case "address":
				this.data.address = e.detail.value;
				break;
			case "postcode":
				this.data.postcode = e.detail.value;
				break;
			default:
				break;
		}
	}
})