function getTotalPrice(cart) {
	var i,
		length,
		unit = 0,
		amount = 0,
		subtotal = 0.00;

	for (i = 0, length = cart.length; i < length; i++) {
		unit = cart[i].unit;
		amount = cart[i].amount;
		subtotal += unit * amount;
	}
	return (Math.round(subtotal * 100) / 100)
}

function getCheckedPrice(cart) {
	var i,
		length,
		unit = 0,
		amount = 0,
		subtotal = 0.00;

	for (i = 0, length = cart.length; i < length; i++) {
		if (cart[i].checked) {
			unit = cart[i].unit;
			amount = cart[i].amount;
			subtotal += unit * amount;
		}
	}
	return (Math.round(subtotal * 100) / 100)
}

module.exports = {
	totalPrice: getTotalPrice,
	checkedPrice: getCheckedPrice
}