// components/uploader.js
const __PROMISIFY__ = require('../../utils/promisify.js');
const __URI__ = require('../../utils/uri.constant.js');
const __MAX_UPLOAD_FILES__ = 9;

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        //  上传按键文本
        uploadBtnText: {
            type: String,
            value: '上传'
        },
        maxUploadFiles: {
            type: Number,
            value: 9
        }
    },

    /**
     * 组件的初始数据
     */
    data: {


    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 逐张上传图片
         */
        _oneByOne: function(gallery) {
            let options = { //   设置上传图片的API参数
                    url: __URI__.uploadImage(),
                    filePaths: gallery.tempFilePaths, //    调用wx.chooseImage后返回的图片临时地址数组
                    fileIndex: 0, //        上传第一张图片
                    name: 'gallery', //     KEY默认是 'file'，如果需要更改KEY，需要在formData中设置属性 fieldName
                    formData: {
                        fieldName: 'gallery'
                    }
                },
                //  初始化Promise
                promise = new Promise((resolve, reject) => {
                    resolve(options);
                }),
                result = [];

            wx.showLoading({
                title: '上传中',
                mask: true
            })

            for (let i = 0, length = gallery.tempFilePaths.length; i < length; i++) {
                promise =
                    promise.then(__PROMISIFY__.uploadFile)
                    .then(res => {
                        //  上传成功后，记录图片的远端OSS地址
                        if (res.hasOwnProperty('data')) {
                            const temp = JSON.parse(res.data);
                            if (temp.hasOwnProperty('code') && temp.code === 0) {
                                result.push({
                                    index: i, //    索引
                                    id: temp.data.imageId, //    服务器上的图片ID
                                    name: temp.data.name, //     图片名称
                                    source: temp.data.transition //  图片地址
                                })
                            }
                        }
                        console.log('完成上传第 ' + (i + 1) + ' 张图片，图片地址：', gallery.tempFilePaths[i]);
                        if ((i + 1) === gallery.tempFilePaths.length) {
                            wx.hideLoading();
                            //  已全部上传完成，返回图片地址的数组
                            return new Promise((resolve, reject) => {
                                resolve(result);
                            });
                        } else {
                            //  否则，构建下一次要上传图片的API参数
                            options.fileIndex = i + 1; //    在选择图片后的微信返回的临时数组中的索引
                            return new Promise((resolve, reject) => {
                                resolve(options);
                            });
                        }
                    });
            }

            return promise;
        },

        /**
         *  上传按键的点击事件
         */
        _onTapUploadImage: function() {
            const that = this;
            __PROMISIFY__
                .chooseImage({
                    count: this.data.maxUploadFiles,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera']
                })
                .then(this._oneByOne)
                .then(res => {
                    console.log(res);
                    that.triggerEvent('uploadCompletedEvt', res);
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
})