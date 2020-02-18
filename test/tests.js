/*
	Snapper unit tests - using qUnit
*/

window.onload = function(){
	/* TESTS HERE */

	// toss dependency...
	test( 'API Properties: toss is defined', function() {
		//ok( toss );
	});

	test( 'API Properties: toss is a function', function() {
		ok( typeof( toss ) === "function" );
	});

	//snapper tests
	test( 'API Properties: $.fn.snapper is a function', function() {
		ok( typeof( $.fn.snapper ) === "function" );
	});

	asyncTest( 'Enhancement steps', function() {
		ok( $(".snapper_items > *:eq(2)").attr( "class" ) === undefined, "no classes applied at first" );
		ok( $(".snapper_items > *:eq(2)").css( "float", "none" ), "no floats at first" );
		ok( $(".snapper_items").attr( "style" ) === undefined, "no style inline applied" );
		document.documentElement.className += "enhanced";
		$(function(){
			$( ".snapper" ).snapper();
			start();
			//ok($(".snapper_items > *:eq(2)").css("float", "left"));
			//ok($(".snapper_items").attr("style") !== undefined, "style inline applied");
			//ok($(".snapper_items > *:eq(2)").attr("style") !== undefined, "style inline applied");
			//ok($(".snapper_pane").css("overflow") === "auto", "pane has overflow auto");
			ok($(".snapper_pane").width() < $(".snapper_items").width(), "pane is narrower than items in it now");
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
		expect(2);
		var originalHash = window.location.hash;
		$(".snapper_pane")[0].scrollLeft = 0;
		$(".snapper_nav a:eq(2)").trigger( "click" );
		setTimeout(function(){
			ok( $(".snapper_pane")[0].scrollLeft !== 0, "scroll changed" );
			if( $(".snapper").attr( "data-snapper-deeplinking" ) === "false" ) {
				ok( window.location.hash === originalHash, "location hash did not change, deep linking is disabled" )
			} else {
				ok( window.location.hash === $(".snapper_nav a:eq(2)").attr( "href" ), "location hash set to active slide" )
			}
			start();
		},1000);
	});

	asyncTest( 'random # link clicks are ignored', function() {
		$(".snapper").snapper();
		expect(1);
		$("#testlink").trigger( "click" );
		ok( true );
		start();
	});
	asyncTest( 'Arrows navigate', function() {
		$(".snapper").snapper();
		expect(1);
		$(".snapper_pane")[0].scrollLeft = 0;
		setTimeout(function(){
			ok( $(".snapper_pane")[0].scrollLeft > 0 );
			start();
		}, 1000);
		$(".snapper_nextprev_next").trigger( "click" );
	});

	asyncTest( 'Arrows navigate part 2', function() {
		$(".snapper").snapper();
		expect(1);
		$(".snapper_pane")[0].scrollLeft = 500;
		setTimeout(function(){
			ok( $(".snapper_pane")[0].scrollLeft < 500 );
			start();
		}, 1000);
		$(".snapper_nextprev_prev").trigger( "click" );
	});

	

	asyncTest( 'get index returns correct index after goto', function(){
		var $snapper = $(".snapper").snapper();
		equal($snapper.snapper("getIndex"), 0);

		$(document).one("snapper.after-next", function(){
			equal($snapper.snapper("getIndex"), 1);

			$(document).one("snapper.after-goto", function(){
				equal($snapper.snapper("getIndex"), 2);
				start();
			});

			$snapper.snapper("goto", 2);
		});

		$snapper.snapper("goto", 1);
	});

	asyncTest( 'autoplay advances a few times once started', function(){
		expect(4);
		var eventCounter = 0;
		var checkBinding;
		var $snapperElem = $(".snapper");
		var $snapper;

		$snapperElem.attr( "data-snapper-autoplay", "500" );

		$(document).one("snapper.after-goto", checkBinding = function(){
			ok(true, "after-goto called");

			if(++eventCounter === 3){
				$snapper.removeAttr( "data-snapper-autoplay" );
				start();
			} else {
				$(document).one("snapper.after-goto", checkBinding);
			}
		});

		$snapper = $snapperElem.snapper();
		equal($snapper.snapper("getIndex"), 0);
	});

};
