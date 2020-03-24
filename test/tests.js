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

	
	asyncTest( 'Snapping occurs after scrolling to a spot that is not a snap point', function() {
		expect(1);
		$(".snapper").snapper();
		$(".snapper_pane")[0].scrollLeft = 0;
		$(".snapper_pane")[0].scrollLeft = 35;
		setTimeout(function(){
			ok( $(".snapper_pane")[0].scrollLeft ===0 );
			start();
		},1000);
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


	asyncTest( 'disabled arrow classes are present at extremes', function() {
		$(".snapper").snapper();
		expect(4);
		
		
		setTimeout(function(){
			ok( $(".snapper_nextprev_prev.snapper_nextprev-disabled").length === 0, "prev link is not disabled ");
			ok( $(".snapper_nextprev_next.snapper_nextprev-disabled").length === 1, "next link is disabled ");
		 	start();
		 },2000);

		 ok( $(".snapper_nextprev_prev.snapper_nextprev-disabled").length === 1, "prev link is disabled ");
		 ok( $(".snapper_nextprev_next.snapper_nextprev-disabled").length === 0, "next link is not disabled ");
 
		 $(".snapper_pane")[0].scrollTo(5000,0);
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

	asyncTest( 'looping goes endlessly forward', function(){
		expect(5);
		var eventCounter = 0;
		var checkBinding;
		var $snapperElem = $(".snapper");
		var $snapper;

		$snapperElem.attr( "data-snapper-loop", "500" );

		$snapperElem.bind("snapper.after-next", checkBinding = function(){
			ok(true, "after-next called");

			if(++eventCounter === 5){
				$snapperElem.removeAttr( "data-snapper-loop" );
				$(document).unbind("snapper.after-goto", checkBinding);
				start();
			}
			else{
				$(".snapper_nextprev_next").click();
			} 
		});

		$snapperElem.snapper();
		setTimeout(() => {
			$(".snapper_nextprev_next").click();
		 }, 500);
	});


	asyncTest( 'looping goes endlessly in reverse', function(){
		expect(5);
		var eventCounter = 0;
		var checkBinding;
		var $snapperElem = $(".snapper");
		var $snapper;

		$snapperElem.attr( "data-snapper-loop", "500" );

		$snapperElem.bind("snapper.after-prev", checkBinding = function(){
			ok(true, "after-prev called");

			if(++eventCounter === 5){
				$snapperElem.removeAttr( "data-snapper-loop" );
				$(document).unbind("snapper.after-goto", checkBinding);
				start();
			}
			else{
				$(".snapper_nextprev_prev").click();
			} 
		});

		$snapperElem.snapper();
		setTimeout(() => {
			$(".snapper_nextprev_prev").click();
		 }, 500);
	});

};
