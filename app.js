//app.js
const __PROMISIFY__ = require('./utils/promisify.js');
const __USER__ = require('./services/user.service.js');

App({
    isLogIn: false,

    /**
     * 		启动加载
     */
    onLaunch: function() {
        let that = this;

        __PROMISIFY__
            .showLoading({ //  开始，显示加载框
                title: '玩命加载中',
                mask: true
            })
            .then(that.wxLogin) //	小程序登录
            .catch(exception => {
                console.error('Login failed!')
                console.error(exception);
            })
            .finally(() => {
                __PROMISIFY__.hideLoading();
            });
    },

    /**
     * 		第三方登录
     */
    wxLogin: function() {
        let that = this,
            startTime;

        return __PROMISIFY__.login() //	  调用登录接口获取临时登录凭证（code）
            .then(message => {
                console.log(message);
                return new Promise((resolve, reject) => {
                    if (message.hasOwnProperty('errMsg') && message.errMsg === 'login:ok') {
                        startTime = Date.now();
                        resolve({
                            authorizer_appid: 'wxc91180e424549fbf',
                            code: message.code
                        });
                    } else {
                        reject(message); //	发生错误
                    }
                });
            })
            .then(__USER__.userLogin) //  	访问后端，用code获取session key
            .then(result => { //   对结果进行转换
                console.log(result);
                return new Promise((resolve, reject) => {
                    if (result.statusCode === 404) {
                        reject('Not found'); //	发生错误
                    } else if (result.data.hasOwnProperty('errcode') && result.data.errcode !== 0) {
                        reject(result.data); //	发生错误
                    } else if (result.data.hasOwnProperty('code') && result.data.code === 0) {
                        resolve({
                            key: '__KEY__',
                            data: {
                                session: result.data.data.value.session,
                                publicKey: result.data.data.publicKey,
                                //	与服务端的系统时间进行校准
                                //	将请求时间 + 网络延误与系统时间进行比较，计算误差
                                duration: Math.round(result.data.data.serverTime - ((startTime + Date.now()) / 2))
                            }
                        });
                    } else {
                        reject(result.data); //	发生错误
                    }
                });
            })
            .then(__PROMISIFY__.setStorage) //  存入本地
            .then(result => {
                that.isLogIn = true;
                return new Promise((resolve, reject) => {
                    resolve('Log in.')
                })
            });
    }
})

/** app.json */

// "tabBar": {
//     "color": "#888888",
//     "selectedColor": "#FFFFFF",
//     "backgroundColor": "#813c85",
//     "borderStyle": "white",
//     "list": [{
//             "pagePath": "pages/shopping/index/index",
//             "text": "好物",
//             "iconPath": "icons/tabBar/nice-grey.png",
//             "selectedIconPath": "icons/tabBar/nice-white.png"
//         },
//         {
//             "pagePath": "pages/my/orders/orders",
//             "text": "我的",
//             "iconPath": "icons/tabBar/my-grey.png",
//             "selectedIconPath": "icons/tabBar/my-white.png"
//         }
//     ]
// }