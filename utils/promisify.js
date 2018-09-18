const Promise = require('../lib/es6-promise.js').Promise;

/**
 *  封装
 */
function Promisify(fn) {
	return function (options = {}) {
		return new Promise((resolve, reject) => {
			options.success = function (result) {
				resolve(result);
			}
			options.fail = function (reason) {
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

module.exports = {
	Promisify: Promisify
}