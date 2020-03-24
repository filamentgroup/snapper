/*
	Snapper unit tests - using qUnit
*/

window.onload = function(){
	/* TESTS HERE */

	

	//snapper tests
	test( 'API Properties: $.fn.snapper is a function', function() {
		ok( typeof( $.fn.snapper ) === "function" );
	});

	asyncTest( 'Enhancement steps', function() {
		$(function(){
			$( ".snapper" ).snapper();
			start();
			ok($(".snapper_nextprev").length, "next prev generated");
			ok($(".snapper_nextprev a").length === 2, "2 next prev links");
		});
		
		
	});

	
	

	asyncTest( 'thumbnail clicks cause pane to scroll', function() {
		$(".snapper").snapper();
		expect(1);
		$(".snapper_pane")[0].scrollLeft = 0;
		 $(".snapper_nav a").last().trigger( "click" );
		 setTimeout(function(){
			 ok( $(".snapper_pane")[0].scrollLeft !== 0, "scroll changed" );
		 	 start();
		 },1000);
	});

	asyncTest( 'Arrows navigate', function() {
		$(".snapper").snapper();
		expect(1);
		$(".snapper_pane")[0].scrollLeft = 0;
		
		 setTimeout(function(){
			 ok( $(".snapper_pane")[0].scrollLeft !== 0, "scroll changed" );
		 	 start();
		 },2000);
		 setTimeout(() => {
			$(".snapper_nextprev_next").click();
		 }, 1000);
	});


	asyncTest( 'Arrows navigate back', function() {
		$(".snapper").snapper();
		expect(2);
		$(".snapper_pane")[0].scrollLeft = 0;

		setTimeout(function(){
			ok( $(".snapper_pane")[0].scrollLeft === 0, "scroll changed" );
			 start();
		},4000);

		 setTimeout(function(){
			 ok( $(".snapper_pane")[0].scrollLeft !== 0, "scroll changed" );
			 $(".snapper_nextprev_prev").click();
		 },2000);

		 setTimeout(function(){
			$(".snapper_nextprev_next").click();
		 }, 1000);
	});








	asyncTest( 'random # link clicks are ignored', function() {
		$(".snapper").snapper();
		expect(1);
		$("#testlink").trigger( "click" );
		ok( true );
		start();
	});

	

	asyncTest( 'get index returns correct index after goto', function(){
		var $snapper = $(".snapper").snapper();
		expect(1);
		
	
		setTimeout(function(){
			equal($snapper.snapper("getIndex"), 1);
			start();
		}, 2000);

		$snapper.snapper("goto", 1);
	});

	asyncTest( 'autoplay advances a few times once started', function(){
		expect(2);
		var eventCounter = 0;
		var checkBinding;
		var $snapperElem = $(".snapper");
		var $snapper;

		$snapperElem.attr( "data-snapper-autoplay", "500" );

		$snapperElem.bind("snapper.after-goto", checkBinding = function(){
			ok(true, "after-goto called");

			if(++eventCounter === 2){
				$snapperElem.removeAttr( "data-snapper-autoplay" );
				$(document).unbind("snapper.after-goto", checkBinding);
				start();
			} 
		});

		$snapperElem.snapper();
	});

};
