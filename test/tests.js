/*
Snapper unit tests - using qUnit
*/

window.onload = function(){



		/* TESTS HERE */


		// overthrow dependency...
		test( 'API Properties: overthrow is defined', function() {
			ok( overthrow );
		});

		test( 'API Properties: overthrow is an object', function() {
			ok( typeof( overthrow ) === "object" );
		});

		//snapper tests
		test( 'API Properties: $.fn.snapper is a function', function() {
			ok( typeof( $.fn.snapper ) === "function" );
		});

		test( 'Enhancement steps', function() {
			ok( $(".snapper_items > *:eq(2)").attr( "class" ) === undefined, "no classes applied at first" );
			ok( $(".snapper_items > *:eq(2)").css( "float", "none" ), "no floats at first" );
			ok( $(".snapper_items").attr( "style" ) === undefined, "no style inline applied" );
			document.documentElement.className += "enhanced";
			$(function(){
	      $( ".snapper" ).snapper();
	    });
			ok( $(".snapper_items > *:eq(2)").css( "float", "left" ) );
			ok( $(".snapper_items").attr( "style" ) !== undefined, "style inline applied" );
			ok( $(".snapper_items > *:eq(2)").attr( "style" ) !== undefined, "style inline applied" );
			ok( $(".snapper_pane").css( "overflow" ) === "auto", "pane has overflow auto" );
			ok( $(".snapper_pane").width() < $(".snapper_items" ).width(), "pane is narrower than items in it now" );
			ok( $(".snapper_nextprev").length, "next prev generated" );
			ok( $(".snapper_nextprev a").length === 2, "2 next prev links" );
		});

		asyncTest( 'Snapping occurs after scrolling to a spot that is not a snap point', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 0;
			$(".snapper_pane")[0].scrollLeft = 35;
			setTimeout(function(){
				ok( $(".snapper_pane")[0].scrollLeft ===0 );
				start();
			},1000);
		});

		asyncTest( 'thumbnail clicks cause pane to scroll', function() {
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
			expect(1);
			$("#testlink").trigger( "click" );
			ok( true );
			start();
		});

		asyncTest( 'Snap event check', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 0;

				$(".snapper").bind( "snapper.snap", function(e, o){
					ok( o.activeSlides.length > 0 );
					start();
				});
				$(".snapper_pane")[0].scrollLeft = 35;
		});

		asyncTest( 'Arrows navigate', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 0;
			setTimeout(function(){
					ok( $(".snapper_pane")[0].scrollLeft > 0 );
					start();
				}, 1000);
				$(".snapper_nextprev_next").trigger( "click" );
		});

		asyncTest( 'Arrows navigate part 2', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 500;
			setTimeout(function(){
					ok( $(".snapper_pane")[0].scrollLeft < 500 );
					start();
				}, 1000);
				$(".snapper_nextprev_prev").trigger( "click" );
		});

		asyncTest( 'fwd arrow loops to 0', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 5000;
			setTimeout(function(){
					ok( $(".snapper_pane")[0].scrollLeft === 0 );
					start();
				}, 1000);
				$(".snapper_nextprev_next").trigger( "click" );
		});

		asyncTest( 'back arrow loops to end', function() {
			expect(1);
			$(".snapper_pane")[0].scrollLeft = 0;
			setTimeout(function(){
					ok( $(".snapper_pane")[0].scrollLeft === $(".snapper_pane")[0].scrollWidth );
					start();
				}, 1000);
				$(".snapper_nextprev_prev").trigger( "click" );
		});











};
