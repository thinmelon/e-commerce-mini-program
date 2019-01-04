const __CRYPT__ = require('../utils/crypt.js');
const __URI__ = require('../utils/uri.constant.js');
const __PROMISIFY__ = require('../utils/promisify.js');

/**
 *  用户登录
 */
const userLogin = (request) => {
    const url = __URI__.userLogin(request.authorizer_appid);
    return __PROMISIFY__.postRequest(url, {
        code: request.code
    });
}

/**
 * 	保存用户的微信账号信息
 */
const saveUserInfo = (request) => {
    const url = __URI__.saveUserInfo(request.session);
    return __PROMISIFY__.putRequest(url, {
        userInfo: request.userInfo
    });
}

/**
 * 	切换身份
 */
const switchIdentity = (request) => {
    const url = __URI__.switchIdentity(request.session);
    return __PROMISIFY__.getRequest(url, {});
}

/**
 * 	我的资产
 */
const getMyCapital = () => {
    const url = __URI__.getMyCapital(encodeURIComponent(__CRYPT__.encryptData('')));
    return __PROMISIFY__.getRequest(url, {});
}

module.exports = {
    userLogin: userLogin,
    saveUserInfo: saveUserInfo,
    switchIdentity: switchIdentity,
    getMyCapital: getMyCapital
}