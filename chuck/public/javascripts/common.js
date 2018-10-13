var isblog;

function nav(num){
	$('.nav>a').eq(num).addClass('active').siblings().removeClass('active');
	if(num==3){
		isblog = true;
	}
}

function PullDownMenu(){
	$('.nav>a:nth-of-type(4)').mouseover(function(){
		$('.pull-down-menu').addClass('on');
	})
	$('.nav>a:nth-of-type(4)').mouseout(function(){
		$('.pull-down-menu').removeClass('on');
	})
	$('.pull-down-menu').mouseover(function(){
		$('.pull-down-menu').addClass('on');
		$('.nav>a:nth-of-type(4)').addClass('active');
	})
	$('.pull-down-menu').mouseout(function(){
		$('.pull-down-menu').removeClass('on');
		if(!isblog){
			$('.nav>a:nth-of-type(4)').removeClass('active');
		}
	})
}


