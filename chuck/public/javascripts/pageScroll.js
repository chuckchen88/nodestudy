function pageScroll(objs,num,smallObj){
	var allH=$(document).outerHeight();
	var winH=$(window).height();
	objs.height(winH);
	$(window).resize(function(){
		allH=$(document).outerHeight();
		winH=$(window).height();
		objs.height(winH);
		$("html,body").scrollTop(n*winH);
	});
	var stepn=allH-winH;
	document.documentElement.style.overflow="hidden";
	//$("html,body").css('overflow','hidden');
	var n=0;
	var tm;
	objs.eq(n).addClass('active');

	var starttime = 0,
        endtime = 0;
	var scoFun=function(delta){
		starttime = new Date().getTime(); //记录翻屏的初始时间
		if(delta<0&&(starttime == 0 || (endtime - starttime) <= -500)){
			if(n<num){
				n=n+1;
				$("html,body").animate({
					scrollTop:n*winH+"px"
				},{ 
				    easing: 'easeInOutExpo', 
				    duration: 1000, 
				    complete: function(){} 
				});
				endtime = new Date().getTime();    //记录翻屏的结束时间
				objs.eq(n).addClass('active').siblings().removeClass('active');
				smallObj.eq(n).addClass('active').siblings().removeClass('active');
			}
		}
		else if(delta>0 && (starttime == 0 || (endtime - starttime) <= -500)) {    
			if(n>0){
				n=n-1;
				$("html,body").animate({
					scrollTop:n*winH+"px"
				},{ 
				    easing: 'easeInOutExpo', 
				    duration: 1000, 
				    complete: function(){} 
				});
				endtime = new Date().getTime(); 
				objs.eq(n).addClass('active').siblings().removeClass('active');
				smallObj.eq(n).addClass('active').siblings().removeClass('active');
				return false;
			}
		}
	};
	$(window).mousewheel(function scor(event,delta,deltaX,deltaY){
		scoFun(delta);
	});
	smallObj.click(function(){
		n = $(this).index()+1;

		scoFun(n);
		$(this).addClass('active').siblings().removeClass('active');
	});
	$('.scroll-more').each(function(index){
		$(this).click(function(){
			n = index+2;
			if(n>=num+1){
				n=1;
			}
			scoFun(n);
		})
	})
}