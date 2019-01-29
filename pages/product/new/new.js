// pages/product/new/new.js
const __BACKBONE__ = require('../../../services/backbone.service.js');

Page({
    /**
     * 页面的初始数据
     */
    data: {
        step: 0,
        introduction: '',
        type: '',
        source: [],
        maxSteps: 0
    },

    /**
     * 私有数据 - 
     */
    //  页面配置
    settings: [{
            index: 0,
            introduction: '设置类型',
            type: 'radio',
            source: [{
                    key: 0,
                    value: '实物类',
                    checked: true
                },
                {
                    key: 1,
                    value: '虚拟类（如卡券）'
                }
            ]
        },
        {
            index: 1,
            introduction: '设置标题',
            type: 'text',
            source: ''
        },
        {
            index: 2,
            introduction: '设置款式及规格',
            type: 'stock',
            source: []
        },
        {
            index: 3,
            introduction: '上传微缩图',
            type: 'uploader',
            source: []
        },
        {
            index: 4,
            introduction: '上传详情图',
            type: 'uploader',
            source: []
        }
    ],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this._setSteps(0);
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
     * 上一步事件
     */
    onTapPrevious: function(e) {
        console.log(e)
        this.settings[e.detail.step].source = e.detail.source;
        console.log(this.settings[e.detail.step])
        this._setSteps(e.detail.step - 1);
    },

    /**
     *  下一步事件
     */
    onTapNext: function(e) {
        console.log(e)
        this.settings[e.detail.step].source = e.detail.source;
        console.log(this.settings[e.detail.step])
        const errorMessage = this._checkValidity(this.settings[e.detail.step]);
        if (errorMessage === '') {
            if ((e.detail.step + 1) < this.data.maxSteps) {
                this._setSteps(e.detail.step + 1);
            } else {
                console.log(this.settings);
                // 转换数据并提交保存商品
                const product = this._convertParameter(this.settings);
                console.log(product);
                // TODO: 上传商品
                const bid = wx.getStorageSync('__MY_BUSINESS__')._id;

                __BACKBONE__
                    .addProduct({
                        bid: bid,
                        product: JSON.stringify(product)
                    })
                    .then(res => {
                        console.log(res)
                    })

            }
        } else {
            wx.showToast({
                title: errorMessage,
                icon: 'none',
                duration: 3000
            });
        }
    },

    /**
     *  提前校验输入的有效性
     */
    _checkValidity: function(setting) {
        switch (setting.type) {
            case 'text':
                if (setting.source instanceof Array || setting.source.trim() === '')
                    return '标题不能为空';
                break;
            case 'stock':
                if (setting.source.length === 0 || setting.source.sku.length === 0)
                    return '库存不能为空';
                break;
            case 'uploader':
                if (setting.source instanceof Array && setting.source.length === 0)
                    return '未上传图片';
                break;
            default:
                break;
        }
        return '';
    },

    /**
     *  设置
     */
    _setSteps: function(index) {
        this.setData({
            step: this.settings[index].index,
            introduction: this.settings[index].introduction,
            type: this.settings[index].type,
            source: this.settings[index].source,
            maxSteps: this.settings.length
        })
    },

    _convertParameter: function(settings) {
        let product = {
            pid: ''
        };
        settings.map(item => {
            switch (item.index) {
                case 0: //  类型
                    item.source.map(data => {
                        if (data.checked) {
                            product.type = data.key;
                        }
                    })
                    break;
                case 1: //  标题
                    product.name = item.source;
                    break;
                case 2: //  款式及规格
                    product.attributes = item.source.attributes;
                    product.sku = item.source.sku;
                    break;
                case 3: //  微缩图
                    product.thumbnails = item.source.map(thumbnail => {
                        return {
                            url: thumbnail.source, //  图片URL
                            index: thumbnail.index //  图片索引
                        };
                    });
                    break;
                case 4: //  详情图
                    product.details = item.source.map(detail => {
                        return {
                            url: detail.source, //  图片URL
                            index: detail.index //  图片索引
                        };
                    });
                    break;
                default:
                    break;
            }
        })
        return product;
    }
})