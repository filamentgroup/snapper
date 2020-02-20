/* snapper css snap points carousel */
;(function( w, $ ){
	var pluginName = "snapper";
	$.fn[ pluginName ] = function(optionsOrMethod){
		var pluginArgs = arguments;

		function observerCallback( entries, observer ){
			entries.forEach(entry => {
				if (entry.isIntersecting && entry.intersectionRatio >= .75 ) {
					entry.target.classList.add( pluginName + "_item-active" );
				}
				else {
					entry.target.classList.remove( pluginName + "_item-active" );
				}
			});
		}

		function observeItems( elem ){
			window.observer = new IntersectionObserver(observerCallback, {root: elem, threshold: .75 });
			$( elem ).find( "." + pluginName + "_item" ).each(function(){
				observer.observe(this);
			});
			return observer;
		}


		// get the snapper_item elements whose left offsets fall within the scroll pane.
		function activeItems( elem ){
			return $( elem ).find( "." + pluginName + "_item-active" );
		}


		function goto( elem, x, useDeepLinking, callback ){
			elem.scrollTo({ left: x, behavior: "smooth" });
			var activeSlides = activeItems( elem );
			 $( elem ).trigger( pluginName + ".after-goto", {
			 	activeSlides: activeSlides[ 0 ]
			 });
			if( callback ){ 
				callback();
			};
			//TODO
			if( useDeepLinking && "replaceState" in w.history ){
				w.history.replaceState( {}, document.title, "#" + activeSlides[ 0 ].id );
			}
		}


		var result, innerResult;

		// Loop through snapper elements and enhance/bind events
		result = this.each(function(){
			if( innerResult !== undefined ){
				return;
			}

			var self = this;
			var $self = $( self );
			var addNextPrev = $self.is( "[data-" + pluginName + "-nextprev]" );
			var autoTimeout;
			var $slider = $( "." + pluginName + "_pane", self );
			var $itemsContain = $slider.find( "." + pluginName + "_items" );
			var $items = $itemsContain.children();
			$items.addClass( pluginName + "_item" );
			var numItems = $items.length;
			var $nav = $( "." + pluginName + "_nav", self );
			var navActiveClass = pluginName + "_nav_item-selected";
			var useDeepLinking = !$self.is( "[data-snapper-deeplinking]" ) || $self.attr( "data-snapper-deeplinking]" ) === "true";
			

			if( typeof optionsOrMethod === "string" ){
				var args = Array.prototype.slice.call(pluginArgs, 1);
				var index;

				switch(optionsOrMethod) {
				case "goto":
					index = args[0] % numItems;
					offset = $slider.find( "." + pluginName + "_item" ).eq( index );
					goto( $slider[ 0 ], offset, useDeepLinking, function(){
						// invoke the callback if it was supplied
						if( typeof args[1] === "function" ){
							args[1]();
						}
					});
					break;
				case "getIndex":
					innerResult = activeItems($self).get();
					break;
				case "updateWidths":
					// no longer does anything.
					break;
				}

				return;
			}

			// avoid double enhance activities
			if( $self.attr("data-" + pluginName + "-enhanced") ) {
				return;
			}

			// give the pane a tabindex for arrow key handling
			$slider.attr("tabindex", "0");


			// if the nextprev option is set, add the nextprev nav
			if( addNextPrev ){
				var	$nextprev = $( '<ul class="snapper_nextprev"><li class="snapper_nextprev_item"><a href="#prev" class="snapper_nextprev_prev">Prev</a></li><li class="snapper_nextprev_item"><a href="#next" class="snapper_nextprev_next">Next</a></li></ul>' );
				var $nextprevContain = $( ".snapper_nextprev_contain", self );
				if( !$nextprevContain.length ){
					$nextprevContain = $( self );
				}
				$nextprev.appendTo( $nextprevContain );
			}

			// This click binding will allow deep-linking to slides without causing the page to scroll to the carousel container
			// this also supports click handling for generated next/prev links
			$( "a", this ).bind( "click", function( e ){
				clearTimeout(autoTimeout);
				var slideID = $( this ).attr( "href" );

				if( $( this ).is( ".snapper_nextprev_next" ) ){
					e.preventDefault();
					return arrowNavigate( true );
				}
				else if( $( this ).is( ".snapper_nextprev_prev" ) ){
					e.preventDefault();
					return arrowNavigate( false );
				}
				// internal links to slides
				else if( slideID.indexOf( "#" ) === 0 && slideID.length > 1 ){
					e.preventDefault();
					gotoSlide( slideID );
				}
			});

			function gotoSlide( href, callback ){
				var $slide = $( href, self );
				if( $slide.length ){
					goto( $slider[ 0 ], $slide[ 0 ].offsetLeft, useDeepLinking, function(){
						if( callback ){
							callback();
						}
					} );
				}
			}


			// retain snapping on resize 
			// only firefox needs this! (feb 2020)
			var afterResize;
			function snapStay(){
				clearTimeout( afterResize );
				afterResize = setTimeout( function(){
					$slider[ 0 ].scrollBy(0,0);
				}, 100 );
			}
			$( w ).bind( "resize", snapStay );

			// next/prev links or arrows should loop back to the other end when an extreme is reached
			function arrowNavigate( forward ){
				if( forward ){
					next();
				}
				else {
					prev();
				}
			}

			// advance slide one full scrollpane's width forward
			function next(){
				var currentActive =  activeItems($slider).first();
				var next = currentActive.next();
				if( next.length ){
					gotoSlide( "#" + next.attr( "id" ), function(){
						$slider.trigger( pluginName + ".after-next" );
					} );
				}
			}

			// advance slide one full scrollpane's width backwards
			function prev(){
				var currentActive =  activeItems($slider).first();
				var prev = currentActive.prev();
				if( prev.length ){
					gotoSlide( "#" + prev.attr( "id" ), function(){
						$slider.trigger( pluginName + ".after-next" );
					} );
				}
			}

			// update thumbnail state on pane scroll
			if( $nav.length ){
				// function for scrolling to the xy of the active thumbnail
				function scrollNav(elem, x, y){
					elem.scrollTo({ left: x, top: y, behavior: "smooth" })
				}
				var lastActiveItem;
				function activeItem( force ){
					var currTime = new Date().getTime();
					if( !force && lastActiveItem && currTime - lastActiveItem < 200 ){
						return;
					}
					lastActiveItem = currTime;
					var navWidth = $nav.width();
					var navHeight = $nav.height();
					var actives = activeItems($slider);
					if( actives.length ){
					$nav.find( "a" ).removeClass( navActiveClass );
						actives.each(function(){
							var elID = this.id;
							var pairedLink = $nav.find( "a[href='#" + elID + "']" );
							pairedLink.addClass( navActiveClass );
						});
						var thumbX = actives[ 0 ].offsetLeft;
						var thumbY = actives[ 0 ].offsetTop;
						scrollNav( $nav[ 0 ], thumbX, thumbY );
					}
				}

				// set active item on init
				activeItem();
				observeItems($slider[ 0 ]);
				//$slider.bind( "scroll", activeItem );
			}

			// apply snapping after scroll, in browsers that don't support CSS scroll-snap
			var scrolling;
			var lastScroll = 0;

			$slider.bind( "scroll", function(e){
				lastScroll = new Date().getTime();
				scrolling = true;
			});

			setInterval(function(){
				if( scrolling && lastScroll <= new Date().getTime() - 150) {
					if( activeItem ){
						activeItem( true );
					}
					scrolling = false;
				}
			}, 150);



			function getAutoplayInterval() {
				var autoTiming = $self.attr( "data-snapper-autoplay" );
				if( autoTiming ) {
					autoTiming = parseInt(autoTiming, 10) || 5000;
				}

				return autoTiming;
			}

			// if the `data-autoplay` attribute is assigned a natural number value
			// use it to make the slides cycle until there is a user interaction
			function autoplay( autoTiming ) {
				if( autoTiming ){
					// autoTimeout is cleared in each user interaction binding
					autoTimeout = setTimeout(function(){
						var timeout = getAutoplayInterval();
						if( timeout ) {
							arrowNavigate(true);
							autoplay( timeout );
						}
					}, autoTiming);
				}
			}

			// if a touch event is fired on the snapper we know the user is trying to
			// interact with it and we should disable the auto play
			$slider.bind("pointerdown click mouseenter focus", function(){
				clearTimeout(autoTimeout);
			});

			autoplay( getAutoplayInterval() );
			$self.attr("data-" + pluginName + "-enhanced", true);
		});

		return (innerResult !== undefined ? innerResult : result);
	};
}( this, jQuery ));
