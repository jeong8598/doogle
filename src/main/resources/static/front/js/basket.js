$(function(){
	// 배송 및 결제금액 스크롤시 위치조정
	$(window).scroll(function(){
		var chk= document.documentElement.scrollTop;

		if(chk<400){
			$(".cart_result").css("position","absolute");
			$("#pkc").css("position","absolute");
			$(".cart_result").css("top","340px");
		}else if(chk>=400){
			$("#pkc").css("position","fixed");
			$("#pkc").css("left","1300px");
			$(".cart_result").css("position","fixed");
			$(".cart_result").css("top","-70px");
		}
	});
	
	//체크박스 관련
	var chkAll = $("input:checkbox[name=bno]").length;
	var chkedNum = $("input:checkbox[name=bno]:checked").length;
	
	//체크된상품 따라 버튼 값 변경
	function chgBtn(){
		if(chkAll===0){
				$("#submit").attr("class","btn disable");
				$("#submit").prop("disabled",true)
				$("#submit").text("상품을 담아주세요");
				
				$(".check-all").prop("checked",false);
				$(".check-all").prop("disabled",true);
		}else{
			if(chkedNum==0){
				$("#submit").attr("class","btn disable");
				$("#submit").prop("disabled",true);
				$("#submit").text("상품을 선택해주세요");
			}else{
				$("#submit").attr("class","btn active");
				$("#submit").prop("disabled",false);
				$("#submit").text("주문하기");
			}
		}
	}
	
	//체크된개수, 전체개수 세기
	function cntNum(){
		chkAll = $("input:checkbox[name=bno]").length;
		chkedNum = $("input:checkbox[name=bno]:checked").length;
		
		$(".check-num").text(chkedNum);
		$(".all-num").text(chkAll);
		chgBtn();
	}
	
	//체크박스 하나 선택
	$("input:checkbox[name=bno]").on("change",function(){
		 cntNum();
		if(chkAll==chkedNum){
			$(".check-all").prop("checked", true);
		}else{
			$(".check-all").prop("checked", false);
		}
		changeTotalPrice();
	});
	
	//전체해제 & 체크
	$(".check-all").click(function(){
		var isChk = $(this).is(":checked");
		if(isChk){
			$(".check-all").prop("checked", true);
			$("input:checkbox[name=bno]").prop("checked", true);
		}else{
			$(".check-all").prop("checked", false);
			$("input:checkbox[name=bno]").prop("checked", false);
		}
		cntNum();
		changeTotalPrice();
	});
	
	//수량 올리기
	$('.btn.plus').on('click',function () {
		var n = $('.btn.plus').index(this);
		var num = Number($(".num:eq(" + n + ")").val());
		
		num++;
		
		$('.num').eq(n).attr("readonly",false);
		$(".num:eq(" + n + ")").val(num);
		$('.num').eq(n).attr("readonly",true);
		$('.quantity').eq(n).val(num);
		chgQuantity(num,n);
	});
	
	//수량 내리기
	$('.btn.minus').on('click',function () {
		var n = $('.btn.minus.off').index(this);
		var num = Number($(".num:eq(" + n + ")").val());
		if(num>1){
			num--;
			$('.num').eq(n).attr("readonly",false);
			$(".num:eq(" + n + ")").val(num);
			$('.num').eq(n).attr("readonly",true);
			$('.quantity').eq(n).val(num);
			chgQuantity(num,n);
	    }
	});

	//수량 db업데이트
	function chgQuantity(quantity,index){
		var bno = Number($("input[name=bno]").eq(index).val());

		$.ajax({
			url: '/front/shop/basket/chgQuantity'
			, type: 'post'
			,traditional : true
			, data: {
				quantity:quantity,
				bno:bno
			},success: function(){
				//$(".totalPrice").eq(index).val(total);
				changePrice(quantity,index);
				changeTotalPrice();
				
			}, error: function(error){
				console.log("에러 : " + error);
           	}
		});
	}
	
	var price = 0;	//원래가격
	var discount = 0; //할인율
	var total = 0; //할인미적용 총금액
	var earn = 0; //적립률
	var quantity = 0;	//수량
	
	var disPrice = 0;	//한개 할인금액
	var totalEarn = 0;	//할인 후 적립금
	var totalDiscount = 0;	//총 할인가격
	var totalPrice = 0;	//할인미적용 총 가격
	
	//제품별 가격 계산
	function changePrice(quantity,index){
		price = $(".onePrice").eq(index).val()!=null ? parseInt(Number($(".onePrice").eq(index).val())) : 0;
		discount = $(".discount").eq(index).val()!=null ? Number($(".discount").eq(index).val()) : 0;
		earn = $(".earn").eq(index).val()!=0 ? Number($(".earn").eq(index).val()) : 5;
		total = price*quantity;	//총 금액
		
		$(".totalPrice").eq(index).val(total);	//총 금액 넣어주기
		
		if(discount>0){	//할인하면
			$(".in-price").eq(index).find(".cost").text(addComma(total)+'원');	//(할인안한)금액 넣기
			
			disPrice = Math.round(price*(1-discount/100));	//1개 할인 후 가격을 넣기
			totalPrice = disPrice*quantity;	//할인 후 총 금액(=결제금액)
			totalDiscount = total-totalPrice;	//할인한 금액
			$(".totalDiscount").eq(index).val(totalDiscount);	//할인금액넣어주기
		}else{	//할인안하면
			totalPrice = total;	//총 금액 그대로 결제금액
			
			$(".totalDiscount").eq(index).val(0);	//할인금액 = 0
		}
		$(".selling").eq(index).text(addComma(totalPrice)+'원');	//결제 금액
		totalEarn = totalPrice*earn/100;		//적립금 계산
		$(".totalEarn").eq(index).val(Math.round(totalEarn));	//적립금 넣어주기
	}
	
	//로드되었을때 총 할인가격과 적립금 넣어주기 (체크박스 변동있을 때 값계산 위해)
	$("input:checkbox[name=bno]").each(function(index) {
		quantity = $(".quantity").eq(index).val()!=null ? Number($(".quantity").eq(index).val()) : 0;
		changePrice(quantity,index);
	});
	
	//총 금액과 배송비계산하기
	function changeTotalPrice(){
		totalPrice = 0;	//총 상품 금액
		totalDiscount = 0;	//총 할인금액
		totalEarn = 0;	//총 적립금
		var payment = 0;	//결제예정금액
		
		$("input:checkbox[name=bno]:checked").each(function() {
			var index = $("input:checkbox[name=bno]").index(this);
			if(Number($(".totalPrice").eq(index).val())!=null){
				totalPrice += Number($(".totalPrice").eq(index).val());
			}
			if(Number($(".totalDiscount").eq(index).val())!=null){
				totalDiscount += Number($(".totalDiscount").eq(index).val());
			}
			totalEarn += Number($(".totalEarn").eq(index).val());
		});
		
		payment = totalPrice-totalDiscount;
		totalPrice = addComma(totalPrice);
		totalDiscount = addComma(totalDiscount);
		totalEarn = addComma(totalEarn);
		
		//지불금액 4만원이하일 때 배송비 3000원추가됨
		if(payment<40000){
			$(".free-limit").remove();
			$(".fee").text("+3,000");
			var str = '<p class="free-limit">';
			str += addComma(40000-payment);
			str += '원 추가주문 시, <strong>무료배송</strong></p>';
			$(".lst").before(str);
			//3000원추가
			payment=addComma(payment+3000);
			$(".payment").text(payment);
		//4만원이상일 때
		}else if(payment>=40000){
			$(".fee").text("0");
			payment = addComma(payment);
			$(".payment").text(payment);
			$(".free-limit").remove();
		}
		$(".total").text(totalPrice);
		$(".totalDisPrice").text(totalDiscount);
		$(".totalEarn").text(totalEarn);
	}

	//숫자콤마추가
	function addComma(x) {
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	//장바구니 비었을 때 안에 넣을 문구
	function itemChk(){
		if($(".box").length==0){
			var div = $(".cart-item").parent();
			div.prop("class","empty");
			
			var html ='<div class="inner-empty">'
			html += '<span class="bg"></span><p class="txt">장바구니에 담긴 상품이 없습니다</p></div>'
			$(".cart-item>div:first").after(html);
		}
	}

	//삭제버튼 클릭
	$(".btn-delete").click(function(){
		var answer;
		var chkArr = [];
		if($(this).val()=="선택삭제"){
			$("input:checkbox[name=bno]:checked").each(function() {
				
				chkArr.push($(this).val()); 
			});
			if(chkArr.length==0){
				alert("삭제할 상품을 선택해주세요.");
			}else{
				answer = confirm("선택한 상품을 삭제하시겠습니까?");
				if(answer == true){
					delChkBasket(1,chkArr);
				}
			}
		}else{
			var bno = $(this).val();
			
			var isChk = $("#bno"+bno).is(":checked");
			if(isChk){
				deleteOne(1,bno);
			}else{
				deleteOne(0,bno);
			}
		}
	});
	
	//구매불가 삭제
	$(".btn_shown").click(function(){
		var chkArr = [];
		$("input:checkbox[name=disBno]").each(function() {
			chkArr.push($(this).val()); 
		});
		$(this).remove();
		delChkBasket(0,chkArr);
	});
	
	//선택된 값 삭제
	function delChkBasket(chk,chkArr){
		$.ajax({
			url: '/shop/delChkBasket'
			, type: 'post'
			,traditional : true
			, data: {
				bnoArr : chkArr
			},success: function(){
				for(i=0 ;  i<chkArr.length ; i++){
					var box = $('#bno'+chkArr[i]).parents('.box')
					$('#bno'+chkArr[i]).parents('li').remove();
					var liCnt = box.find("li").length;
					if(liCnt==0){
						box.remove();
						itemChk();
					}
				}
				if(chk===1){
					changePrice();
					changeTotalPrice();
					cntNum();
				}
				
			}, error: function(error){
				console.log("에러 : " + error);
           	}
		});
	}
	
	//상품 1개 삭제
	function deleteOne(chk,bno){
		
		$.ajax({
			url: '/shop/deleteBasket'
			, type: 'post'
			,traditional : true
			, data: {
				bno:bno
			},success: function(){
				var box = $('#bno'+bno).parents('.box')
				$('#bno'+bno).parents('li').remove();
				var liCnt = box.find("li").length;
				if(liCnt==0){
					box.remove();
					itemChk();
				}
				if(chk===1){
					changePrice();
					changeTotalPrice();
					cntNum();
				}
			}
		});
	}
	
	//리스트 드롭업다운
	$(".btn_dropup").click(function(){
		var index = $(".btn_dropup").index(this);
		var list = $(".list").eq(index);
		if(list.css("display") == "none"){
			$(".btn_dropup").eq(index).css("background-image","url('/static/front/img/shop/basket/bdropup.JPG')");
		    list.css("display","block");
		} else {
			$(".btn_dropup").eq(index).css("background-image","url('/static/front/img/shop/basket/bdropdown.JPG')");
			list.css("display","none");
		}
	});
	
	const jusoPopup = (func = null) => {
	const popupWidth = 570;
	const popupHeight = 420;
	const left = Math.ceil((window.screen.width - popupWidth) / 2);
	const top = Math.ceil((window.screen.height - popupHeight) / 2);
	if (func === 'showUpdateAddrBtns')
		window.open(`/jusoPopup?func=${func}`, 'pop', `width=${popupWidth},height=${popupHeight}, scrollbars=yes, resizable=yes, left=${left}, top=${top}`);
	else
		window.open('/jusoPopup', 'pop', `width=${popupWidth},height=${popupHeight}, scrollbars=yes, resizable=yes, left=${left}, top=${top}`);
	};
	
	function jusoCallBack(roadAddrPart1, addrDetail, zipNo, func = null) {
		if (func !== null && func === 'showUpdateAddrBtns') {
			const spanZipcode = document.querySelector('#zipcode');
			const spanAddr = document.querySelector('#addr');
			const spanAddr_detail = document.querySelector('#addr_detail');
	
			spanAddr_detail.innerHTML = addrDetail;
			spanZipcode.innerHTML = zipNo;
			spanAddr.innerHTML = roadAddrPart1;
			showUpdateAddrBtns();
		} else {
			const zipcode = document.querySelector('input[name=zipcode]');
			const addr = document.querySelector('input[name=addr]');
			const addr_detail = document.querySelector('input[name=addr_detail]');
			
			data1 = zipNo;
			data2 = roadAddrPart1;
			data3 = addrDetail;
			openWin = window.open("/delivery_pop?zipNo=" + data1 + "&roadAddrPart1=" + data2 + "&addrDetail=" + data3, "", 'width=800,height=430', "_black");
			window.close();
			//addr.value = roadAddrPart1;
			//addr_detail.value = addrDetail;
			//zipcode.value = zipNo;	
		}
	};
	
	function updatePop() {
	
		$(".dno").click(function() {
			var dno = $(this).find(".dno1").val();
			var mno = $(".session").val();
			window.open("/deliveryUpdate?dno=" + dno + "&mno="+mno, "주소수정", "width=500, height=500");
		})
	}
	
	$(function(){
		$(".checkbox_class").each(function(i) {
			var value = $(this).val();
			console.log(value);
			if (value == 'y'){
				$(".checkbox_class").eq(i).attr("checked", true);
			}
		});
	});
	
	function update() {
		$(".dno").click(function() {
			var default_yn = $(this).find(".checkbox_class").val();
			var dno = $(this).find(".dno1").val();
			var mno = $(".session").val();
			
			$.ajax({
				url: "/delivery_defaultUpdate?dno=" + dno +"&mno="+mno,
				type: "get",
				data: {
				},
				dataType: "text",
				success: function() {
					console.log("기본배송지 변경완료");
				}
	
			});
		});
		alert("기본배송지 변경 완료")

	}

	itemChk();
	chgBtn();














});