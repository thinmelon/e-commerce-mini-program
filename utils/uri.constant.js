/**
 *  访问地址前缀
 */
const PROTOCOL = 'https://';
const HOST = 'www.pusudo.cn';
const PREFIX_SHOPPING = PROTOCOL + HOST + '/shopping';
const PREFIX_USER = PROTOCOL + HOST + '/user';
const PREFIX_STORAGE = PROTOCOL + HOST + '/oss';

/**
 *  商品列表
 */
const fetchProductList = (session, businessId, offset, amount) => {
    return `${PREFIX_SHOPPING}/product/partial?session=${ session }&businessId=${ businessId }&offset=${ offset }&amount=${ amount }`;
}

/** 
 *   商品详情
 */
const fetchProductDetail = (product_id) => {
    return `${PREFIX_SHOPPING}/product/detail/${product_id}`;
}

/**
 *   提交统一订单
 */
const submitUnifiedOrder = () => {
    return `${PREFIX_SHOPPING}/order`;
}

/**
 * 	重新支付
 */
const repay = () => {
    return `${PREFIX_SHOPPING}/order/repay`;
}

/**
 * 	关闭订单
 */
const closeOrder = () => {
    return `${PREFIX_SHOPPING}/order`;
}

/**
 *   查询微信支付订单
 */
const queryWechatPayOrder = (out_trade_no) => {
    return `${PREFIX_SHOPPING}/order/${out_trade_no}`;
}

/**
 * 	  查询用户是否已购买过该商品
 */
const queryEverBought = (session, stock_no) => {
    return `${PREFIX_SHOPPING}/product/everBought?session=${session}&stock_no=${stock_no}`;
}

/**
 * 	获取退款进度
 */
const queryRefundInfo = () => {
    return `${PREFIX_SHOPPING}/refund/progress`;
}

/**
 * 	将卡券放入卡包
 */
const putIntoCardHolder = () => {
    return `${PREFIX_SHOPPING}/card/holder`;
}

/**
 * 	在用户领取卡券至微信卡包后，记录用户的领取记录
 */
const recordUserCard = () => {
    return `${PREFIX_SHOPPING}/card/user`;
}

/**
 * 对应指定订单列表，用户所购买的卡券列表
 */
const queryUserCards = () => {
    return `${PREFIX_SHOPPING}/card/user/orders`;
}

/**
 * 
 */
const fetchOnlineBusinessList = (session) => {
    return `${PREFIX_SHOPPING}/business/online?session=${session}`;
}

/**
 *   用户登录
 */
const userLogin = (appid) => {
    // return `${PREFIX_USER}/login`;
    return `${PREFIX_USER}/miniprogram/${appid}`;
}

/**
 *   添加新的收件人
 */
const addNewConsignee = (session) => {
    return `${PREFIX_USER}/consignee/${session}`;
}

/**
 *   编辑收件人
 */
const editConsignee = (session) => {
    return `${PREFIX_USER}/consignee/${session}`;
}

/**
 *   移除收件人
 */
const removeConsignee = (session) => {
    return `${PREFIX_USER}/consignee/${session}`;
}

/**
 *   缺省收件人
 */
const defaultConsignee = (session) => {
    return `${PREFIX_USER}/default/consignee/${session}`;
}

/**
 *   我的收件人列表
 */
const myConsignee = (session) => {
    return `${PREFIX_USER}/my/consignee/${session}`;
}

/**
 *   我的购物车
 */
const myCart = (session) => {
    return `${PREFIX_USER}/my/cart/${session}`;
}

/**
 *   添加至购物车
 */
const joinToCart = () => {
    return `${PREFIX_USER}/cart`;
}

/**
 *   添加至购物车
 */
const updateMyCart = () => {
    return `${PREFIX_USER}/cart`;
}

/**
 *   从购物车移除商品
 */
const removeMyCart = () => {
    return `${PREFIX_USER}/cart`;
}

/**
 *   提交订单后从购物车移除要买的商品
 */
const renewMyCart = () => {
    return `${PREFIX_USER}/cart/afterSubmit`;
}

/**
 *   获取我的历史订单
 */
const fetchMyOrders = () => {
    return `${PREFIX_USER}/my/order`;
}

/**
 *  由用户发起退款申请
 */
const submitRefund = () => {
    return `${PREFIX_USER}/my/refund`;
}

/**
 * 	获得临时Token
 */
const fetchSTSToken = (session) => {
    return `${PREFIX_STORAGE}/${session}`;
}

/**
 *   上传图片
 */
const uploadImage = () => {
    return `${PREFIX_STORAGE}/image`;
}

/**
 *   上传图片
 */
const uploadVideo = () => {
    return `${PREFIX_STORAGE}/video`;
}

/**
 *  图片地址
 */
const imageUrlPrefix = (name) => {
    return `${PREFIX_STORAGE}/image/${encodeURIComponent(name)}`;
}

/**
 *  图文素材
 */
const fetchOfficialMaterial = (mediaId) => {
    return `${PREFIX_STORAGE}/official/material/${mediaId}`;
}

/**
 *  文章地址
 */
const fetchOfficialNews = (url) => {
    return `${PREFIX_STORAGE}/official/news?url=${url}`;
}

module.exports = {
    submitUnifiedOrder: submitUnifiedOrder,
    repay: repay,
    closeOrder: closeOrder,
    submitRefund: submitRefund,
    queryWechatPayOrder: queryWechatPayOrder,
    queryRefundInfo: queryRefundInfo,
    queryEverBought: queryEverBought,
    putIntoCardHolder: putIntoCardHolder,
    recordUserCard: recordUserCard,
    queryUserCards: queryUserCards,
    fetchOnlineBusinessList: fetchOnlineBusinessList,
    userLogin: userLogin,
    addNewConsignee: addNewConsignee,
    editConsignee: editConsignee,
    removeConsignee: removeConsignee,
    defaultConsignee: defaultConsignee,
    myConsignee: myConsignee,
    myCart: myCart,
    joinToCart: joinToCart,
    updateMyCart: updateMyCart,
    removeMyCart: removeMyCart,
    renewMyCart: renewMyCart,
    uploadImage: uploadImage,
    uploadVideo: uploadVideo,
    fetchProductList: fetchProductList,
    fetchProductDetail: fetchProductDetail,
    fetchMyOrders: fetchMyOrders,
    fetchSTSToken: fetchSTSToken,
    imageUrlPrefix: imageUrlPrefix,
    fetchOfficialMaterial: fetchOfficialMaterial,
    fetchOfficialNews: fetchOfficialNews
}