const __CRYPT__ = require('../utils/crypt.js');
const __URI__ = require('../utils/uri.constant.js');
const __PROMISIFY__ = require('../utils/promisify.js');

/**
 *  订单状态
 */
const __ENUM_ORDER_STATUS__ = [
    '未支付', //    	NOTPAY: 0,
    '支付成功', // 		SUCCESS: 1,
    '转入退款', //		REFUND: 2,
    '已关闭', //		 CLOSE: 3,
    '已撤销（刷卡支付）', //		REVOKED: 4,
    '用户支付中', //		USERPAYING: 5,
    '支付失败', //		PAYERROR: 6,
    '状态异常' //		ABNORMAL: 7
];

/**
 *      账单流水类型
 */
const __ENUM_BILL_TYPE__ = [
    '微信小程序支付',
    '提现',
    '退款'
];

/**
 *      账单流水状态
 */
const __ENUM_BILL_STATUS__ = [
    '已完成',
    '冻结',
    '退款中',
    '已退款'
];

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

/**
 * 获取当前授权方下的账单流水 
 */
const getBillList = (request) => {
    const url = __URI__.getBillList(
        encodeURIComponent(__CRYPT__.encryptData('')),
        request.offset,
        request.amount
    );
    return __PROMISIFY__.getRequest(url, {});
}

/**
 * 获取我的银行卡信息
 */
const getMyBankCard = (request) => {
    const url = __URI__.getMyBankCard(
        encodeURIComponent(__CRYPT__.encryptData(''))
    );
    return __PROMISIFY__.getRequest(url, {});
}

/**
 * 发送验证码
 */
const sendVerificationCode = (request) => {
    const url = __URI__.sendVerificationCode(
        encodeURIComponent(__CRYPT__.encryptData(''))
    );
    return __PROMISIFY__.postRequest(url, {
        phone: request.phone
    });
}

/**
 * 申请提现
 */
const withdrawCash = (request) => {
    const url = __URI__.withdrawCash(
        encodeURIComponent(__CRYPT__.encryptData(''))
    );
    return __PROMISIFY__.postRequest(url, {
        appid: request.appid,
        requestId: request.requestId,
        bizId: request.bizId,
        phone: request.phone,
        verificationCode: request.verificationCode,
        withdraw: request.withdraw
    });
}

/**
 * 添加商品
 */
const addProduct = (request) => {
    const url = __URI__.addProduct(
        encodeURIComponent(__CRYPT__.encryptData('')),
        request.bid
    );
    return __PROMISIFY__.postRequest(url, {
        product: request.product
    });
}

module.exports = {
    __ENUM_ORDER_STATUS__: __ENUM_ORDER_STATUS__,
    __ENUM_BILL_TYPE__: __ENUM_BILL_TYPE__,
    __ENUM_BILL_STATUS__: __ENUM_BILL_STATUS__,
    getAuthorizerList: getAuthorizerList,
    getBusinessList: getBusinessList,
    getProductList: getProductList,
    getOrderList: getOrderList,
    getBillList: getBillList,
    getMyBankCard: getMyBankCard,
    sendVerificationCode: sendVerificationCode,
    withdrawCash: withdrawCash,
    addProduct: addProduct
}