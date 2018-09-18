// pages/shopping/index/index.js
const __URI__ = require('../../../utils/uri.constant.js');
const __DATE__ = require('../../../utils/date.formatter.js');
const __WX_API_PROMISE__ = require('../../../utils/wx.api.promise.js');
const __SHOPPING__ = require('../../../services/wechat.pay.service.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        collections: Array,
        swiperHeight: 320, //  滚动图片的高度
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.fetchProductListWrapper();
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
     * 		--	只有定义了此事件处理函数，右上角菜单才会显示 “转发” 按钮
     * 		--	用户点击转发按钮的时候会调用
     * 		--	此事件需要 return 一个 Object，用于自定义转发内容
     * options 参数说明
     * 		--	from	String	转发事件来源。button：页面内转发按钮；menu：右上角转发菜单
     * 		--	target	Object	如果 from 值是 button，则 target 是触发这次转发事件的 button，否则为 undefined
     * 自定义转发字段
     * 		--	title	转发标题	当前小程序名称
     * 		--	path	转发路径	当前页面 path ，必须是以 / 开头的完整路径
     * 		--	imageUrl	自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，
     * 								支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
     */
    onShareAppMessage: function(options) {
        return {
            title: '好好吃饭',
            path: '/pages/shopping/index/index'
        }
    },

    /**
     * 	跳转至商品详情
     */
    bindTapCollections: function(e) {
        wx.navigateTo({
            url: '/pages/shopping/product/product?pid=' + e.currentTarget.dataset.product.pid
        })
    },

    fetchProductListWrapper: function() {
        console.log('isLogin  ==>  ' + getApp().isLogIn);
        if (getApp().isLogIn) {
            this.fetchProductList();
        } else {
            setTimeout(() => {
                this.fetchProductListWrapper();
            }, 1000);
        }
    },

    /**
     * 	获取商品列表
     */
    fetchProductList: function() {
        let that = this;

        __SHOPPING__
            .fetchProductList(
                wx.getStorageSync('__SESSION_KEY__'),
                wx.getStorageSync('__AUTHORIZER_BUSINESSID__'),
                0, 5)
            .then(res => {
                console.log(res)
                if (res.data.code === 0) {
                    let products = res.data.msg.product.map(item => {
                        let thumbnails = res.data.msg.gallery.filter(image => {
                            return image.productid === item.pid;
                        }).map(thumbnail => {
                            thumbnail.name = __URI__.imageUrlPrefix(thumbnail.name);
                            return thumbnail;
                        })
                        item.name = decodeURIComponent(item.name);
                        item.thumbnails = thumbnails;

                        return item;
                    })
                    console.log(products);

                    that.setData({
                        collections: products
                    })
                } else if (res.data.code === -800) {
                    __WX_API_PROMISE__
                        .showToast(res.data.msg, 'none', '/icons/public/hint.png')
                        .then(() => {
                            that.fetchProductList();
                        });
                }
            });
    }
})