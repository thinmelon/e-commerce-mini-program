const Promisify = require('./promisify.js').Promisify;

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
 * 获取系统信息
 * brand	手机品牌	1.5.0
 * model	手机型号
 * pixelRatio	设备像素比
 * screenWidth	屏幕宽度	1.1.0
 * screenHeight	屏幕高度	1.1.0
 * windowWidth	可使用窗口宽度
 * windowHeight	可使用窗口高度
 * statusBarHeight	状态栏的高度	1.9.0
 * language	微信设置的语言
 * version	微信版本号
 * system	操作系统版本
 * platform	客户端平台
 * fontSizeSetting	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px	1.5.0
 * SDKVersion	客户端基础库版本
 */
function wxGetSystemInfoPromise() {
    return Promisify(wx.getSystemInfo)();
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
 * 调用接口wx.login() 获取临时登录凭证（code）
 */
function wxLoginPromise() {
    return Promisify(wx.login)();
}

/**
 * 调用wx.requestPayment(OBJECT)发起微信支付
 * 
 */
function wxRequestPaymentPromise(options) {
    return Promisify(wx.requestPayment)({
        'timeStamp': options.data.timeStamp, //	时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
        'nonceStr': options.data.nonceStr, //	随机字符串，长度为32个字符以下
        'package': options.data.package, // 统一下单接口返回的 prepay_id 参数值
        'signType': 'MD5', //	签名类型，默认为MD5
        'paySign': options.data.paySign //	签名
    });
}

/**
 *   显示消息提示框
 *   时长3秒，结束后执行下一步
 */
function wxShowToastPromise(title, icon, image) {
    wx.showToast({
        title: title,
        icon: icon,
        image: image,
        duration: 3000,
        mask: true
    })
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve('Time out.'), 3000);
    });
}

/**
 *   关闭当前页面，跳转到应用内的某个页面。
 */
function wxRedirectToPromise(url) {
    return Promisify(wx.redirectTo)({
        url: url
    });
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
 * 		从本地相册选择图片或使用相机拍照。
 * 		注：文件的临时路径，在小程序本次启动期间可以正常使用
 * 	    如需持久保存，需在主动调用 wx.saveFile，在小程序下次启动时才能访问得到。
 */
function wxChooseImagePromise(options) {
    return Promisify(wx.chooseImage)({
        count: options.count || 9, // 默认9
        sizeType: options.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: options.sourceType || ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
    });
}

/**
 * 		拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
 */
function wxChooseVideoPromise(options) {
    return Promisify(wx.chooseVideo)({
        sourceType: options.sourceType || ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
        compressed: options.compressed || true, //	是否压缩所选的视频源文件，默认值为true，需要压缩
        maxDuration: options.maxDuration || 60 //	拍摄视频最长拍摄时间，单位秒。最长支持 60 秒
    });
}

/**
 * 		将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求
 * 		其中 content-type 为 multipart/form-data
 */
function wxUploadFilePromise(options) {
    return Promisify(wx.uploadFile)({
        url: options.url, //	  开发者服务器 url
        filePath: options.filePath, //	要上传文件资源的路径	
        name: options.name, //	   文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容	
        formData: options.formData || {} //	HTTP 请求中其他额外的 form data	
    });
}

/**
 * 		批量添加卡券
 * 		-	cardList	ObjectArray	是	需要添加的卡券列表
 * 		请求对象说明
 * 		-	cardId	String	卡券 Id
 * 		-	cardExt	String	卡券的扩展参数
 * 		cardExt 说明
 * 			参数	类型	必填	是否参与签名	说明
 * 		-	code	String	否	是	用户领取的 code，仅自定义 code 模式的卡券须填写
 * 		-	openid	String	否	是	指定领取者的openid，只有该用户能领取。
 * 		-	timestamp	Number	是	是	时间戳，东八区时间,UTC+8，单位为秒
 * 		-	nonce_str	String	否	是	随机字符串，由开发者设置传入，加强安全性，不长于 32 位
 * 		-	fixed_begintimestamp	Number	否	否	卡券在第三方系统的实际领取时间
 * 		-	outer_str	String	否	否	领取渠道参数，用于标识本次领取的渠道值
 * 		-	signature	String	是	-	签名
 * 		注：cardExt 需进行 JSON 序列化为字符串传入
 */
function wxAddCardPromise(options) {
    return Promisify(wx.addCard)({
        cardList: options.cardList
    });
}

/**
 * 	查看微信卡包中的卡券
 */
function wxOpenCardPromise(options) {
    return Promisify(wx.openCard)({
        cardList: options.cardList
    });
}

/**
 *  获取当前的地理位置、速度
 */
function wxGetLocationPromise(options) {
    return Promisify(wx.getLocation)({
        type: 'wgs84',
        altitude: false
    });
}

/**
 * 	获取第三方平台自定义的数据字段
 */
function wxGetExtConfigPromise(options) {
    return Promisify(wx.getExtConfig)();
}

module.exports = {
    getRequest: wxGetRequestPromise,
    postRequest: wxPostRequestPromise,
    deleteRequest: wxDeleteRequestPromise,
    putRequest: wxPutRequestPromise,
    getSystemInfo: wxGetSystemInfoPromise,
    setStorage: wxSetStoragePromise,
    login: wxLoginPromise,
    requestPayment: wxRequestPaymentPromise,
    showToast: wxShowToastPromise,
    redirectTo: wxRedirectToPromise,
    showLoading: wxShowLoadingPromise,
    hideLoading: wxHideLoadingPromise,
    chooseImage: wxChooseImagePromise,
    chooseVideo: wxChooseVideoPromise,
    uploadFile: wxUploadFilePromise,
    addCard: wxAddCardPromise,
    openCard: wxOpenCardPromise,
    getLocation: wxGetLocationPromise,
    getExtConfig: wxGetExtConfigPromise
}