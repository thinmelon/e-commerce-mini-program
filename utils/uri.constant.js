/**
 *  访问地址前缀
 */
const PROTOCOL = 'https://';
const HOST = 'www.pusudo.cn';
const PREFIX_BACKBONE = PROTOCOL + HOST + '/backbone';
const PREFIX_PLATFORM = PROTOCOL + HOST + '/platform';
const PREFIX_SHOPPING = PROTOCOL + HOST + '/shopping';
const PREFIX_STORAGE = PROTOCOL + HOST + '/oss';
const PREFIX_USER = PROTOCOL + HOST + '/user';

/**
 *   小程序用户登录
 */
const userLogin = (appid) => {
    return `${PREFIX_PLATFORM}/miniprogram/${appid}`;
}

/**
 *   发送验证码
 */
const sendVerificationCode = (session) => {
    return `${PREFIX_PLATFORM}/sms?session=${session }`;
}

/**
 * 	 保存用户信息
 */
const saveUserInfo = (session) => {
    return `${PREFIX_USER}/userinfo?session=${session}`;
}

/**
 * 	 切换身份
 */
const switchIdentity = (session) => {
    return `${PREFIX_USER}/new/identity?session=${session}`;
}

/**
 * 	获取授权（小程序 / 公众号）列表
 */
const getAuthorizerList = (session, type) => {
    return `${PREFIX_BACKBONE}/wechat/miniprogram/list?session=${session}&type=${type }`;
}

/**
 *  获取当前授权方下的商户列表
 */
const getBusinessList = (session, appid) => {
    return `${PREFIX_BACKBONE}/business/list?session=${session}&appid=${appid }`;
}

/**
 * 获取商品列表
 */
const getProductList = (session, businessId, offset, amount) => {
    return `${PREFIX_BACKBONE}/product/partial?session=${session}&bid=${businessId}&skip=${offset}&limit=${amount }`;
}

/**
 * 获取订单列表
 */
const getOrderList = (session, businessId, offset, amount) => {
    return `${PREFIX_BACKBONE}/order/list?session=${session}&businessId=${businessId}&offset=${offset}&amount=${amount }`;
}

/**
 * 获取账单流水
 */
const getBillList = (session, offset, amount) => {
    return `${PREFIX_BACKBONE}/authorizer/bills?session=${session}&offset=${offset}&amount=${amount}`;
}

/**
 * 获取我的资产信息
 */
const getMyCapital = (session) => {
    return `${PREFIX_BACKBONE}/authorizer/capital?session=${session}`;
}

/**
 * 获取我的银行卡信息
 */
const getMyBankCard = (session) => {
    return `${PREFIX_BACKBONE}/authorizer/bank?session=${session}`;
}

/**
 * 申请提现
 */
const withdrawCash = (session) => {
    return `${PREFIX_BACKBONE}/authorizer/capital/available?session=${session}`;
}

/**
 *  新增商品
 */
const addProduct = (session, businessId) => {
    return `${PREFIX_BACKBONE}/product?session=${session}&bid=${businessId}`;
}

/**
 * 上传图片
 */
const uploadImage = () => {
    return `${PREFIX_STORAGE}/image`;
}

module.exports = {
    userLogin: userLogin,
    sendVerificationCode: sendVerificationCode,
    saveUserInfo: saveUserInfo,
    switchIdentity: switchIdentity,
    getAuthorizerList: getAuthorizerList,
    getBusinessList: getBusinessList,
    getProductList: getProductList,
    getOrderList: getOrderList,
    getBillList: getBillList,
    getMyCapital: getMyCapital,
    getMyBankCard: getMyBankCard,
    withdrawCash: withdrawCash,
    addProduct: addProduct,
    uploadImage: uploadImage
}