
$(function() {

	//체크박스 하나 선택
	$(".ico_check").on("change", function() {
		var chkAll = $(".ico_check").length;
		var chkedNum = $(".ico_check:checked").length;

		if (chkAll == chkedNum) {
			$("#chkBox").prop("checked", true);
		} else {
			$("#chkBox").prop("checked", false);
		}
	});

	//전체해제 & 체크
	$("#chkBox").click(function() {
		var isChk = $(this).is(":checked");
		var chkAll = $(".ico_check").length;
		if (chkAll > 0) {
			if (isChk) {
				$(".ico_check").each(function() {
					$(this).prop("checked", true);
					$("#chkBox").prop("checked", true);
				});

			} else {
				$(".ico_check").each(function() {
					$(this).prop("checked", false);
					$("#chkBox").prop("checked", false);
				});
			};
		} else {
			$(this).prop("checked", false);
		}
	});
	//자리수 옵션
	const option = {
		maximumFractionDigits: 0
	};
	
	//장바구니 추가 모달
	$('#basket-modal').on('show.bs.modal', function(event) {
		var modal = $(this);
		var button = $(event.relatedTarget);
		var pno = button.data('pno');
		var pono = button.data('pono')!=null ? button.data('pono') :0;
		var pname = button.data('pname');
		var discount = button.data('discount')!=null ? parseFloat(button.data('discount')) : 0;
		var pprice = parseFloat(button.data('pprice'));
		var earn = button.data('earn')!=0 ? button.data('earn') : 5;

		//넘겨줄 hidden값 넣어주기
		modal.find('#pno').val(pno);
		modal.find('#pono').val(pono);
		modal.find('#price').val(pprice);
		modal.find('#earn').val(earn);
		modal.find('#discount').val(discount);
		modal.find('.tit_cart').text(pname);

		if(discount!=0){	//할인하면
		
			disPrice = Math.round(pprice*(1-discount/100));	//1개 할인 후 가격을 넣기
			modal.find(".dc_price .price-box").text(addComma(disPrice.toLocaleString('ko-KR',option)));	//(할인안한)금액 넣기
			modal.find(".original_price .price-box").text(addComma(pprice.toLocaleString('ko-KR',option)));	//(할인안한)금액 넣기
			
		}else{
			modal.find(".dc_price .price-box").text(addComma(pprice.toLocaleString(option,'ko-KR')));	//(할인안한)금액 넣기
			modal.find(".original_price").remove();
		}

	});
	/*창이 떠있을 때*/
	$("#basket-modal").on('shown.bs.modal', function() {
		$('.btn_type1 .txt_type').on('click', function() {
			if($(".inp").val()>0){
				var form = $("#addBasket")[0];
				//값넣어주기
				const ajax = axios(
					{
						method: 'post',
						url: '/shop/addBasket',
						data: new FormData(form)
					}
				);
	
				ajax.then((res) => {
					if (res.data) {
						if (res.data == '2')
							showBasket('장바구니에 추가 되었습니다.');
						else if(res.data == '1')
							showBasket('장바구니에 추가 되었습니다. 이미 담으신 상품이 있어서 추가했습니다.');
						else
							alert('장바구니 추가에 실패하였습니다.');
						
					}
				});
			}
			$('#basket-modal').modal('hide');;
		
		});
	});
	//수량버튼
	var dblChk = false;
	$('.btn.up.on').on('click', function() {
		dblChk = true;
		if(dblChk){
			dblChk = false;
			var n = $('.btn.up.on').index(this);
			var num = Number($(".inp:eq(" + n + ")").val());
			num++;
			
			//수량
			$('.inp').eq(n).attr("readonly", false);
			$(".inp:eq(" + n + ")").val(num);
			$('.inp').eq(n).attr("readonly", true);
			chgTotalPrice();
		}
	});

	$('.btn.down.on').on('click', function() {
		dblChk = true;
		if(dblChk){
			dblChk = false;
			var n = $('.btn.down.on').index(this);
			var num = Number($(".inp:eq(" + n + ")").val());

			if(num>0){
				num--;
				$('.inp').eq(n).attr("readonly", false);
				$(".inp:eq(" + n + ")").val(num);
				$('.inp').eq(n).attr("readonly", true);
				chgTotalPrice();
			}
		}
	});

	//총합계 계산
	function chgTotalPrice() {
		totalPrice = 0;	//총 상품 금액
		totalDiscount = 0;	//총 할인금액
		totalEarn = 0;	//총 적립금
		
		var onePrice = Number($(".one-price").val());
		var earn = $(".earn").val()!=null ? Number($(".earn").val()) : 5;
		var quantity = $(".inp").val()!=0 ? Number($(".inp").val()) : 0;
		var discount = $(".discount").val()!=0 ? Number($(".discount").val()) : 0;
		//alert("one"+onePrice+"earn"+earn+"quantity"+quantity+"discount"+discount);
		
		if(discount!=0){
			totalPrice = Math.round(onePrice*(1-discount/100))*quantity;
		}else{
			totalPrice = onePrice*quantity;
		}
		totalEarn = Math.round(totalPrice*earn/100); 
		
		totalPrice = addComma(totalPrice);
		totalEarn = addComma(totalEarn);
		
		$(".num").text(totalPrice);
		$("#saving").text(totalEarn);
	}
	
		
	$('#basket-modal').on('hidden.bs.modal', function() {
		var modal = $(this);
		//값비우기
		modal.find('#pno').val('');
		modal.find('#pono').val('');
		modal.find('#price').val('');
		modal.find('#earn').val('');
		modal.find('#discount').val('');
		modal.find('.tit_cart').text('');
		modal.find('.inp').attr("readonly", false);
		modal.find(".inp").val(0);
		modal.find('.inp').attr("readonly", true);
		modal.find(".num").text(0);
		modal.find("#saving").text(0);
	});
	
	//숫자콤마추가
	function addComma(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	//

/*	//늘사는것 추가 모달
	$('#living-Modal').on('show.bs.modal', function(event) {
		var button = $(event.relatedTarget);
		var pno = button.data('whatever');
		var modal = $(this);

		$.ajax({
			url: 'putOnLiving'
			, type: 'post'
			, traditional: true
			, data: {
				pno: pno
			}, success: function(data) {
				if (data != 0) {
					modal.find('.msg').text("늘 사는 리스트에 추가했습니다.");
				} else {
					modal.find('.msg').text("이미 늘 사는 리스트에 존재하는 상품입니다.");
				}

			}, error: function(error) {
				console.log("에러 : " + error);
			}
		});
	});*/
});