const Promise = require('../lib/es6-promise.js').Promise;

/**
 *  封装
 */
function Promisify(fn) {
    return function(options = {}) {
        return new Promise((resolve, reject) => {
            options.success = function(result) {
                resolve(result);
            }
            options.fail = function(reason) {
                reject(reason);
            }
            fn(options);
        });
    }
}

//无论promise对象最后状态如何都会执行
// Promise.prototype.finally = function (callback) {
// 	let P = this.constructor;
// 	return this.then(
// 		value => P.resolve(callback()).then(() => value),
// 		reason => P.resolve(callback()).then(() => { throw reason })
// 	);
// };

/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function wxGetRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'GET',
        data: data,
        header: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 微信请求post方法封装
 */
function wxPostRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'POST',
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

/**
 * 微信请求delete方法封装
 */
function wxDeleteRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'DELETE',
        data: data,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

/**
 * 微信请求put方法封装
 */
function wxPutRequestPromise(url, data) {
    return Promisify(wx.request)({
        url: url,
        method: 'PUT',
        data: data,
        header: {
            "Content-Type": "application/json"
        }
    })
}

/**
 * 本地存储
 * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容
 */
function wxSetStoragePromise(data) {
    wx.removeStorageSync(data.key);
    return Promisify(wx.setStorage)(data);
}

/**
 * 小程序登录
 * 调用接口wx.login() 获取临时登录凭证（code）
 */
function wxLoginPromise() {
    return Promisify(wx.login)();
}

/**
 * 获取用户信息
 */
function wxGetUserInfoPromise() {
    return Promisify(wx.getUserInfo)();
}

/**
 * 	  显示加载框
 */
function wxShowLoadingPromise(options) {
    return Promisify(wx.showLoading)(options);
}

/**
 *    关闭加载框
 */
function wxHideLoadingPromise() {
    return Promisify(wx.hideLoading)();
}

/**
 *      选择图片
 */
function wxChooseImagePromise(options) {
    return Promisify(wx.chooseImage)({
        count: options.count,
        sizeType: options.sizeType || ['original', 'compressed'],
        sourceType: options.sourceType || ['album', 'camera']
    });
}

/**
 *      上传文件
 */
function wxUploadFilePromise(options) {
    return Promisify(wx.uploadFile)({
        url: options.url,
        filePath: options.filePaths[options.fileIndex],
        name: options.name,
        header: options.header,
        formData: options.formData
    });
}

module.exports = {
    /**
     * 		HTTP 请求
     */
    getRequest: wxGetRequestPromise,
    postRequest: wxPostRequestPromise,
    deleteRequest: wxDeleteRequestPromise,
    putRequest: wxPutRequestPromise,
    /**
     * 		本地存储
     */
    setStorage: wxSetStoragePromise,
    /**
     * 		小程序登录
     */
    login: wxLoginPromise,
    getUserInfo: wxGetUserInfoPromise,
    /**
     * 		等待加载框
     */
    showLoading: wxShowLoadingPromise,
    hideLoading: wxHideLoadingPromise,
    /**
     *      文件管理
     */
    chooseImage: wxChooseImagePromise,
    uploadFile: wxUploadFilePromise
}