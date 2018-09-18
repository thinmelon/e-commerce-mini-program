const __URI__ = require('../utils/uri.constant.js');
const __WX_API_PROMISE__ = require('../utils/wx.api.promise.js');

/**
 *  用户登录
 */
const userLogin = (request) => {
    // const url = __URI__.userLogin();
    // return __WX_API_PROMISE__.postRequest(url, {
    // 	code: request.code
    // });
    const url = __URI__.userLogin(request.authorizer_appid);
    return __WX_API_PROMISE__.postRequest(url, {
        code: request.code,
        refreshTokenInForce: request.refreshTokenInForce
    });
}

/**
 *   添加新的收件人
 */
const addNewConsignee = (session, receiver, mobile, address, postcode) => {
    const url = __URI__.addNewConsignee(session);
    return __WX_API_PROMISE__.postRequest(url, {
        'name': receiver,
        'mobile': mobile,
        'address': address,
        'postcode': postcode,
        'isDefault': 0
    });
}

/**
 *   编辑收件人
 */
const editConsignee = (session, consignee_no, receiver, mobile, address, postcode) => {
    const url = __URI__.editConsignee(session);
    return __WX_API_PROMISE__.putRequest(url, {
        'consignee_no': consignee_no,
        'name': receiver,
        'mobile': mobile,
        'address': address,
        'postcode': postcode
    });
}

/**
 *   移除收件人
 */
const removeConsignee = (session) => {
    const url = __URI__.removeConsignee(session);
    return __WX_API_PROMISE__.deleteRequest(url, {

    });
}

/**
 *   设置缺省收件人
 */
const setAsDefaultConsignee = (session, consignee_no) => {
    const url = __URI__.defaultConsignee(session);
    return __WX_API_PROMISE__.postRequest(url, {
        consignee_no: consignee_no
    });
}

/**
 *  获取缺省收件人
 */
const fetchDefaultConsignee = (session) => {
    const url = __URI__.defaultConsignee(session);
    return __WX_API_PROMISE__.getRequest(url, {});
}

/**
 *   我的收件人列表
 */
const fetchMyConsignee = (session) => {
    const url = __URI__.myConsignee(session);
    return __WX_API_PROMISE__.getRequest(url, {});
}

/**
 *   我的购物车
 */
const fetchMyCart = (session) => {
    const url = __URI__.myCart(session);
    return __WX_API_PROMISE__.getRequest(url, {});
}

/**
 *   加入购物车
 */
const joinToCart = (session, cart) => {
    const url = __URI__.joinToCart();
    return __WX_API_PROMISE__.postRequest(url, {
        session: session,
        cart: cart
    });
}

/**
 *    编辑购物车
 */
const updateMyCart = (session, cart) => {
    const url = __URI__.updateMyCart();
    return __WX_API_PROMISE__.putRequest(url, {
        session: session,
        cart: cart
    });
}

/**
 *   从购物车中移除商品
 */
const removeMyCart = (session, stock_no) => {
    const url = __URI__.removeMyCart();
    return __WX_API_PROMISE__.deleteRequest(url, {
        session: session,
        stock_no: stock_no
    });
}

/**
 *   
 */
const renewMyCart = (session, skuList) => {
    const url = __URI__.renewMyCart();
    console.log(url)
    return __WX_API_PROMISE__.putRequest(url, {
        session: session,
        skuList: skuList
    });
}

/**
 * 	获取我的历史订单列表
 */
const fetchMyOrders = (session, startTime) => {
    const url = __URI__.fetchMyOrders();
    return __WX_API_PROMISE__.postRequest(url, {
        session: session,
        startTime: startTime
    });
}

/**
 * 	提交退款申请
 */
const submitRefund = (session, out_trade_no, refundFee, totalFee, reason, skuList) => {
    const url = __URI__.submitRefund();
    return __WX_API_PROMISE__.postRequest(url, {
        session: session,
        out_trade_no: out_trade_no,
        refundFee: refundFee,
        totalFee: totalFee,
        reason: reason,
        skuList: skuList
    });
}

module.exports = {
    userLogin: userLogin,
    addNewConsignee: addNewConsignee,
    editConsignee: editConsignee,
    removeConsignee: removeConsignee,
    setAsDefaultConsignee: setAsDefaultConsignee,
    fetchDefaultConsignee: fetchDefaultConsignee,
    fetchMyConsignee: fetchMyConsignee,
    fetchMyCart: fetchMyCart,
    joinToCart: joinToCart,
    updateMyCart: updateMyCart,
    removeMyCart: removeMyCart,
    renewMyCart: renewMyCart,
    fetchMyOrders: fetchMyOrders,
    submitRefund: submitRefund
}