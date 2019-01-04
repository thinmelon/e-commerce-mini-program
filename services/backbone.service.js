const __CRYPT__ = require('../utils/crypt.js');
const __URI__ = require('../utils/uri.constant.js');
const __PROMISIFY__ = require('../utils/promisify.js');

/**
 *  获取所有已授权的小程序
 */
const getAuthorizerList = (request) => {
    const url = __URI__.getAuthorizerList(encodeURIComponent(__CRYPT__.encryptData('')), request.type);
    return __PROMISIFY__.getRequest(url, {});
}

/**
 *  获取当前授权方下的商户列表
 */
const getBusinessList = (request) => {
    const url = __URI__.getBusinessList(encodeURIComponent(__CRYPT__.encryptData('')), request.appid);
    return __PROMISIFY__.getRequest(url, {});
}

/**
 *  获取当前商户下的产品列表
 */
const getProductList = (request) => {
    const url = __URI__.getProductList(
        encodeURIComponent(__CRYPT__.encryptData('')),
        request.businessId,
        request.offset,
        request.amount
    );
    return __PROMISIFY__.getRequest(url, {});
}

/**
 * 获取当前商户下的订单列表
 */
const getOrderList = (request) => {
    const url = __URI__.getOrderList(
        encodeURIComponent(__CRYPT__.encryptData('')),
        request.businessId,
        request.offset,
        request.amount
    );
    return __PROMISIFY__.getRequest(url, {});
}

module.exports = {
    getAuthorizerList: getAuthorizerList,
    getBusinessList: getBusinessList,
    getProductList: getProductList,
    getOrderList: getOrderList
}