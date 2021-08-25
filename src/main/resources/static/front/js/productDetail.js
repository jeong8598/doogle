'use strict';

const calc = (t = '+') => {	
		const priceObj = $('input[name=price]');
		const earnObj = $('input[name=earn]');
		const cntObj = $('input[name=cnt]');
		const discountObj = $('input[name=discount]');
		const totalDspPriceObj = $('span.total-price');
		const totalPriceObj = $('input[name=total-price]');
		const dspCntObj = $('input[name=dsp-cnt]');
		let discount = parseInt(discountObj.val());
		let price = parseInt(priceObj.val());
		let earn = parseInt(earnObj.val());
		let cnt = parseInt(cntObj.val());
		let totalPrice = parseInt(totalPriceObj.val());
		let dspCnt = parseInt(dspCntObj.val());

		cnt = t === '+' ? cnt + 1 : cnt - 1;
		dspCnt = cnt;
		totalPrice = discount > 0 ? Math.floor(price - (price * (discount * 0.01))) * cnt : price * cnt;

		cntObj.val(cnt);
		dspCntObj.val(dspCnt);
		totalPriceObj.val(totalDspPriceObj);
		totalDspPriceObj.text(new Intl.NumberFormat().format(totalPrice));
};

const initProductDetail = () => {
	$('button.btn-down').bind('click', () => {		
		const cntObj = $('input[name=cnt]');
		const cnt = parseInt(cntObj.val());

		if (cnt === 0)
			return false;

		calc('-');
	});

	$('button.btn-up').bind('click', () => {
		calc();
	});
	
	$('button.btn-alram').bind('click', () => {
		const quantity = $('#quantity').val();
		const pno = $('#detail-pno').val();

		if (quantity > 0)
			return false;
			
		$.post('/shop/ajax/ok', { pno: pno }, (res) => {
			if (res === 'true')
				alert('재입고 알림이 등록 되었습니다');
			else
				alert('재입고 알림 등록에 실패하였습니다.');
		});
	});

	$('#living-Modal').bind('show.bs.modal', () => {
		const pno = $('#detail-pno').val();
		
		$.post('/shop/putOnLiving', { pno: pno }, (res) => {
			if (res === 'true')
				$('#living-Modal').find('.msg').text("늘 사는 리스트에 추가했습니다.");
			else
				$('#living-Modal').find('.msg').text("이미 늘 사는 리스트에 존재하는 상품입니다.");
		});
	});
	
	$('button.btn-basket').bind('click', () => {
		const pno = $('#detail-pno').val();
		const quantity = $('#quant').val();
		
		$.post('/shop/addBasket', { pno: pno , quantity:quantity }, (res) => {
			if (res === '2')
				showBasket('장바구니에 추가 되었습니다.');
			else if(res === '1')
				showBasket('장바구니에 추가 되었습니다. 이미 담으신 상품이 있어서 추가했습니다.');
			else
				alert('장바구니 추가에 실패하였습니다.');
		});
	});

};

initProductDetail();