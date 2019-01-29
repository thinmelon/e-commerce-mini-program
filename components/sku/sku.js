// components/sku.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // myProperty: { // 属性名
        // 	type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
        // 	value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
        // 	observer: function (newVal, oldVal, changedPath) {
        // 		// 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
        // 		// 通常 newVal 就是新设置的数据， oldVal 是旧数据
        // 	}
        // },
        // myProperty2: String // 简化的定义方式
        model: {
            type: String,
            value: 'NORMAL', //	模式： NORMAL | ‘CART’
        },
        skuList: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 组件内部数据
        editBtnText: '编辑', // 编辑使能键
        selectAll: false, //	全选
        editModel: false, //	是否处于编辑模式
    },

    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () { },
        moved: function () { },
        detached: function () { },
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function () { },

    pageLifetimes: {
        // 组件所在页面的生命周期函数
        show: function () { },
        hide: function () { },
        resize: function () { },
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // // 内部方法建议以下划线开头
        // _myPrivateMethod: function() {
        //     // 这里将 data.A[0].B 设为 'myPrivateData'
        //     this.setData({
        //         'A[0].B': 'myPrivateData'
        //     })
        // },
        // _propertyChange: function(newVal, oldVal) {
        // }

        /**
         * 		全选	
         */
        _checkboxSelectAllChange: function (e) {
            let i, length;

            this.data.selectAll = !this.data.selectAll;
            for (i = 0, length = this.data.skuList.length; i < length; i++) {
                this.data.skuList[i].checked = this.data.selectAll;
            }
            this.setData({
                skuList: this.data.skuList,
                selectAll: this.data.selectAll
            })
            //	发送全选事件给使用者
            this.triggerEvent('selectAllEvent', this.data.skuList, {})
        },

        /**
         * 		单选
         */
        _checkboxSelectSingleChange: function (e) {
            var i,
                j,
                length,
                count;

            for (i = 0, length = this.data.skuList.length; i < length; i++) {
                this.data.skuList[i].checked = false;
                for (j = 0, count = e.detail.value.length; j < count; j++) {
                    if (this.data.skuList[i].stock_no === e.detail.value[j]) {
                        this.data.skuList[i].checked = true;
                        break;
                    }
                }
            }
            this.setData({
                skuList: this.data.skuList
            });
            //	发送单选事件给使用者
            this.triggerEvent('selectSingleEvent', this.data.skuList, {})
        },

        /**
         * 		减少SKU数量
         */
        _bindTapMinus: function (e) {
            this.data.skuList = this.data.skuList.map(product => {
                if (product.stock_no === e.currentTarget.dataset.product.stock_no &&
                    product.amount > 1)
                    product.amount--;
                return product;
            });
            this.setData({
                skuList: this.data.skuList
            });
        },

        /**
         * 		增加SKU数量
         */
        _bindTapAdd: function (e) {
            this.data.skuList = this.data.skuList.map(product => {
                if (product.stock_no === e.currentTarget.dataset.product.stock_no)
                    product.amount++;
                return product;
            });
            this.setData({
                skuList: this.data.skuList
            });
        },

        /**
         *  		直接修改SKU数量
         */
        _bindInputFunc: function (e) {
            this.data.skuList = this.data.skuList.map(product => {
                if (product.stock_no === e.currentTarget.dataset.stock_no)
                    product.amount = parseInt(e.detail.value);
                return product;
            });
            this.setData({
                skuList: this.data.skuList
            });

        },

        /**
         * 			编辑
         */
        _bindTapEdit: function (e) {
            this.data.editModel = !this.data.editModel;
            if (this.data.editModel) {
                this.data.editBtnText = '完成'
            } else {
                this.data.editBtnText = '编辑'
                //	发送编辑事件至使用者
                this.triggerEvent('editEvent', this.data.skuList, {})
            }
            this.setData({
                editBtnText: this.data.editBtnText,
                editModel: this.data.editModel
            })
        },

        /**
         *   		删除
         */
        bindTapDelete: function (e) {
            let that = this;

            // 弹出确认的模式对话框
            wx.showModal({
                title: '请再次确认是否删除？',
                content: '',
                success: function (res) {
                    if (res.confirm) {
                        const index = that.getSkuItemIndex(that.data.skuList, e.currentTarget.dataset.stock_no);
                        if (index > -1) {
                            // 更新本地数据
                            that.data.skuList.splice(index, 1);
                            that.setData({
                                skuList: that.data.skuList
                            })
                            //	发送编辑事件至使用者
                            that.triggerEvent('deleteEvent', that.data.skuList, {})
                        }
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            });
        },

        /**
         * 			获取目标SKU的索引
         */
        getSkuItemIndex: function (sku, id) {
            var i,
                length;

            for (i = 0, length = sku.length; i < length; i++) {
                if (sku[i].stock_no === id) {
                    return i;
                }
            }
            return -1;
        }
    }
})