// components/stock/stock.js
const __HELPER__ = require('../../utils/helper.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        attribute: '', //  输入框
        attributes: [], //  款式数组
        standards: [], //  规格数组
        temp: [],
        sku: [], //  SKU数组 { id | name | values: Array }
        isSaved: false //  添加款式是否完成
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    ready: function() {},

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         *  输入款式
         */
        _onInputAttribute: function(e) {
            this.data.attribute = e.detail.value;
        },

        /**
         *  输入规格
         */
        _onInputStandard: function(e) {
            this.data.standards = this.data.standards.map(item => {
                if (item.id === e.currentTarget.dataset.id) {
                    item.value = e.detail.value;
                }
                return item;
            });
        },

        /**
         *  添加款式
         */
        _onTapAddAttribute: function(e) {
            if (this.data.attribute) {
                if (this.data.attributes.filter(item => {
                        return item === this.data.attribute;
                    }).length === 0) {
                    this.data.attributes.push(this.data.attribute);
                    this.data.standards.push({
                        id: __HELPER__.GetNonceStr(32),
                        name: this.data.attribute,
                        value: ''
                    })
                }
                this.setData({
                    attribute: '', //  清除历史
                    attributes: this.data.attributes,
                    standards: this.data.standards
                })
            } else {
                wx.showToast({
                    title: '请输入要添加的款式',
                    icon: 'none',
                    duration: 3000
                })
            }
        },

        /**
         *  添加规格
         */
        _addStandard: function(e) {
            this.data.standards.push({
                id: __HELPER__.GetNonceStr(32),
                name: e.currentTarget.dataset.name,
                value: ''
            });
            this.setData({
                standards: this.data.standards
            });
        },

        /**
         *  移除规格
         */
        _removeStandard: function(e) {
            let index = -1;
            for (let key in this.data.standards) {
                if (this.data.standards[key].id === e.currentTarget.dataset.id) {
                    index = key;
                    break;
                }
            }
            //找到后从规格数组中移除
            if (index > -1) {
                this.data.standards.splice(index, 1);
                this.setData({
                    standards: this.data.standards
                })
            }
        },

        /**
         *  移除所有相关的规格
         */
        _removeAllStandards: function(e) {
            for (let i = 0; i < this.data.attributes.length; i++) {
                if (this.data.attributes[i] === e.currentTarget.dataset.name) {
                    this.data.attributes.splice(i, 1);
                    break;
                }
            }

            for (let j = this.data.standards.length - 1; j >= 0; j--) {
                if (this.data.standards[j].name === e.currentTarget.dataset.name) {
                    this.data.standards.splice(j, 1);
                }
            }

            this.setData({
                attributes: this.data.attributes,
                standards: this.data.standards
            })
        },

        /**
         *  设置库存按键事件
         */
        _onTapConfirm() {
            this.data.temp = []; // 确保初始temp数组为空
            this.data.standards.map(item => { //  对数据进行加工处理
                let isHit = false;
                for (let i = 0; i < this.data.temp.length; i++) {
                    // 将相同属性名的值归为对象内
                    if (this.data.temp[i].name === item.name) {
                        isHit = true;
                        this.data.temp[i].values.push(item.value.trim());
                        break;
                    }
                }
                if (!isHit) {
                    this.data.temp.push({
                        name: item.name.trim(),
                        values: [item.value.trim()]
                    });
                }
            });

            //  生成库存列表
            this.data.sku = this._generateSKU(this.data.temp.length - 1).map(item => {
                item._id = __HELPER__.GetNonceStr(32); // 为第一项款式规格添加ID
                return item;
            });
            this.setData({
                isSaved: true,
                sku: this.data.sku
            })
            this.triggerEvent('stockChangeEvt', {
                sku: this.data.sku,
                attributes: this.data.temp
            }, {});
        },

        /**
         * 以递归的方式根据输入的属性生成SKU
         * @param n     数组内的索引值
         * @returns {Array}
         */
        _generateSKU(n) {
            const tmp = [];
            //  当递归至最底层时，对属性数组的第一个元素进行加工后直接返回
            if (n <= 0) {
                for (let i = 0; i < this.data.temp[0].values.length; i++) {
                    const item = {
                        unit: 1.00,
                        amount: 1
                    };
                    item[this.data.temp[0].name] = this.data.temp[0].values[i];
                    tmp.push(item);
                }
                return tmp;
            }
            //  获取下一层的结果
            const result = this._generateSKU(n - 1);
            //  整合下一层的结果与该层的数组元素
            for (let j = 0, length = result.length; j < length; j++) {
                for (let k = 0; k < this.data.temp[n].values.length; k++) {
                    result[j][this.data.temp[n].name] = this.data.temp[n].values[k];
                    tmp.push(JSON.parse(JSON.stringify(result[j]))); //  实现对象的深拷贝
                }
            }
            return tmp;
        },

        /**
         *  输入库存单价
         */
        _onInputStockUnit: function(e) {
            const unit = parseFloat(e.detail.value);
            console.log(unit)
            if (unit && unit >= 0.01) {
                this.data.sku = this.data.sku.map(item => {
                    if (item.id === e.currentTarget.dataset.id) {
                        item.unit = unit;
                    }
                    return item;
                });
                this.triggerEvent('stockChangeEvt', {
                    sku: this.data.sku,
                    attributes: this.data.temp
                }, {});
            } else {
                wx.showToast({
                    title: '输入的单价不合法',
                    icon: 'none'
                })
            }

        },

        /**
         *  输入库存数量
         */
        _onInputStockAmount: function(e) {
            const amount = parseFloat(e.detail.value);
            if (amount && amount >= 0) {
                this.data.sku = this.data.sku.map(item => {
                    if (item.id === e.currentTarget.dataset.id) {
                        item.amount = amount;
                    }
                    return item;
                });
                this.triggerEvent('stockChangeEvt', {
                    sku: this.data.sku,
                    attributes: this.data.temp
                }, {});
            } else {
                wx.showToast({
                    title: '输入的数量不合法',
                    icon: 'none'
                })
            }
        }
    }
})