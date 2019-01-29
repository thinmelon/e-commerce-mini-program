// components/steps.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //  第 N 步
        step: {
            type: Number,
            value: 0
        },
        introduction: {
            type: String,
            value: ''
        },
        //  要使用哪种类型的组件
        type: {
            type: String,
            value: ''
        },
        //  组件的属性数组
        source: {
            type: Array,
            value: []
        },
        maxSteps: {
            type: Number,
            value: 0
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         *  radio 切换
         */
        _onRadioChange: function(e) {
            this.data.source = this.data.source.map(item => {
                if (item.key.toString() === e.detail.value) {
                    item.checked = true;
                } else {
                    item.checked = false;
                }
                return item;
            });
        },

        /**
         *  输入商品标题
         */
        onInputTitle: function(e) {
            this.data.source = e.detail.value;
        },

        /**
         * 库存发生变化时
         */
        onStockChanged: function(e) {
            this.data.source = e.detail; //  图片地址数组
        },

        /**
         * 图片上传完成
         */
        onUploadCompleted: function(e) {
            this.data.source = e.detail; //  图片地址数组
        },

        /**
         *  上一步
         */
        _onTapPrevious: function(e) {
            this.triggerEvent('tapPreviousEvt', {
                step: this.data.step,
                source: this.data.source
            }, {})
        },

        /**
         *  下一步
         */
        _onTapNext: function(e) {
            this.triggerEvent('tapNextEvt', {
                step: this.data.step,
                source: this.data.source
            }, {})
        }
    }
})