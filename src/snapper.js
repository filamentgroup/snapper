/* snapper css snap points carousel */
;(function( w, $ ){
	var pluginName = "snapper";
	var navActiveClass = pluginName + "_nav_item-selected";
	$.fn[ pluginName ] = function(optionsOrMethod){
		var pluginArgs = arguments;

		function observerCallback( entries ){
			var parentElem =  $( entries[0].target ).closest( "." + pluginName );
			var navElem = parentElem.find( "." + pluginName + "_nav" );
			for(i in entries){
				var entry = entries[i];
				var entryNavLink = parentElem.find( "a[href='#" + entry.target.id + "']" );
				if (entry.isIntersecting && entry.intersectionRatio >= .75 ) {
					entry.target.classList.add( pluginName + "_item-active" );
					$( entry.target ).trigger( pluginName + ".active" );
					if( navElem.length ){
						entryNavLink[0].classList.add( navActiveClass );
						if( navElem[0].scrollTo ){
							navElem[0].scrollTo({ left: entryNavLink[0].offsetLeft, behavior: "smooth" });
						}
						else {
							navElem[0].scrollLeft = entryNavLink[0].offsetLeft;
						}
					}
				}
				else {
					entry.target.classList.remove( pluginName + "_item-active" );
					$( entry.target ).trigger( pluginName + ".inactive" );
					if( entryNavLink.length ){
						entryNavLink[0].classList.remove( navActiveClass );
					}
				}
			}
		}

		function idItems( $elem ){
			$elem.children().each(function(){
				if( $( this ).attr("id") === undefined ){
					$( this ).attr("id", new Date().getTime() );
				}
			});
		}

		function observeItems( elem ){
			var observer = new IntersectionObserver(observerCallback, {root: elem, threshold: .75 });
			$( elem ).find( "." + pluginName + "_item" ).each(function(){
				observer.observe(this);
			});
			observer.takeRecords();
		}

		// get the snapper_item elements whose left offsets fall within the scroll pane.
		function activeItems( elem ){
			return $( elem ).find( "." + pluginName + "_item-active" );
		}

		// sort an item to either end to ensure there's always something to advance to
		function updateSort(el) {
			if( !$(el).closest( "[data-snapper-loop], [data-loop]" ).length ){
				return;
			}
			var scrollWidth = el.scrollWidth;
			var scrollLeft = el.scrollLeft;
			var contain = $(el).find( "." + pluginName + "_items" );
			var items = contain.children();
			var width = el.offsetWidth;

			if (scrollLeft < width ) {
			  var sortItem = items.last();
			  var sortItemWidth = sortItem.width();
			  contain.prepend(sortItem);
			  el.scrollLeft = scrollLeft + sortItemWidth;
			}
			else if (scrollWidth - scrollLeft - width <= 0 ) {
			  var sortItem = items.first();
			  var sortItemWidth = sortItem.width();
			  contain.append(sortItem);
			  el.scrollLeft = scrollLeft - sortItemWidth;
			}
		}

		// disable or enable snapper arrows depending on whether they can advance
		function setArrowState($el) {
			// old api helper here. 
			if( $el.closest( "[data-snapper-loop], [data-loop]" ).length ){
				return;
			}
			var pane = $el.find(".snapper_pane");
			var nextLink = $el.find(".snapper_nextprev_next");
			var prevLink = $el.find(".snapper_nextprev_prev");
			var currScroll = pane[0].scrollLeft;
			var scrollWidth = pane[0].scrollWidth;
			var width = pane.width();

			var noScrollAvailable = (width === scrollWidth);

			var maxScroll = scrollWidth - width;
			if (currScroll >= maxScroll - 3 || noScrollAvailable ) { // 3 here is arbitrary tolerance
				nextLink
					.addClass("snapper_nextprev-disabled")
					.attr("tabindex", -1);
			} else {
				nextLink
					.removeClass("snapper_nextprev-disabled")
					.attr("tabindex", 0);
			}

			if (currScroll > 3 && !noScrollAvailable ) { // 3 is arbitrary tolerance
				prevLink
					.removeClass("snapper_nextprev-disabled")
					.attr("tabindex", 0);
			} else {
				prevLink
					.addClass("snapper_nextprev-disabled")
					.attr("tabindex", -1);
			}

			if( noScrollAvailable ){
				$el.addClass( "snapper-hide-nav" );
			}
			else {
				$el.removeClass( "snapper-hide-nav" );
			}
		}
  
		function goto( elem, x, callback ){
			if( elem.scrollTo ){
				elem.scrollTo({ left: x, behavior: "smooth" });
			}
			else {
				elem.scrollLeft = x;
			}
			var activeSlides = activeItems( elem );

			$( elem ).trigger( pluginName + ".after-goto", {
			 	activeSlides: activeSlides[ 0 ]
			 });
			if( callback ){ 
				callback();
			};
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
			// give the pane a tabindex for arrow key handling
			$slider.attr("tabindex", "0");
			var $itemsContain = $slider.find( "." + pluginName + "_items" );
			// make sure items are ID'd. This is critical for arrow nav and sorting.
			idItems( $itemsContain );
			var $items = $itemsContain.children();
			$items.addClass( pluginName + "_item" );
			var numItems = $items.length;						

			if( typeof optionsOrMethod === "string" ){
				var args = Array.prototype.slice.call(pluginArgs, 1);
				var index;

				switch(optionsOrMethod) {
				case "goto":
					index = args[0] % numItems;

					var offset = $itemsContain.children().eq(index)[0].offsetLeft;
					goto( $slider[ 0 ], offset, function(){
						// invoke the callback if it was supplied
						if( typeof args[1] === "function" ){
							args[1]();
						}
					});
					break;
				case "getIndex":
					innerResult = activeItems($slider).index();
					break;
				}
				return;
			}

			// avoid double enhance activities
			if( $self.attr("data-" + pluginName + "-enhanced") ) {
				return;
			}

			observeItems($slider[ 0 ]);

			// if the nextprev option is set, add the nextprev nav
			if( addNextPrev ){
				var	$nextprev = $( '<ul class="snapper_nextprev"><li class="snapper_nextprev_item"><a href="#prev" class="snapper_nextprev_prev">Prev</a></li><li class="snapper_nextprev_item"><a href="#next" class="snapper_nextprev_next">Next</a></li></ul>' );
				var $nextprevContain = $( ".snapper_nextprev_contain", self );
				if( !$nextprevContain.length ){
					$nextprevContain = $( self );
				}
				$nextprev.appendTo( $nextprevContain );
			}

			// This click binding will allow linking to slides from thumbnails without causing the page to scroll to the carousel container
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

			// arrow key bindings for next/prev
			$( this )
				.bind( "keydown", function( e ){
					if( e.keyCode === 37 || e.keyCode === 38 ){
						clearTimeout(autoTimeout);
						e.preventDefault();
						e.stopImmediatePropagation();
						arrowNavigate( false );
					}
					if( e.keyCode === 39 || e.keyCode === 40 ){
						clearTimeout(autoTimeout);
						e.preventDefault();
						e.stopImmediatePropagation();
						arrowNavigate( true );
					}
				} );

			function gotoSlide( href, callback ){
				var $slide = $( href, self );
				if( $slide.length ){
					goto( $slider[ 0 ], $slide[ 0 ].offsetLeft, function(){
						if( callback ){
							callback();
						}
					} );
				}
			}


			
			var afterResize;
			var currSlide;
			function resizeUpdates(){
				clearTimeout( afterResize );
				if( !currSlide ){
					currSlide = activeItems($slider).first();
				}
				afterResize = setTimeout( function(){
					// retain snapping on resize 
					gotoSlide( currSlide.attr("id") );
					currSlide = null;
					// resize can reveal or hide slides, so update arrows
					setArrowState( $self );
				}, 300 );
			}
			$( w ).bind( "resize", resizeUpdates );

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
						$slider.trigger( pluginName + ".after-prev" );
					} );
				}
			}

			function getAutoplayInterval() {
				var activeSlide = activeItems($slider).last();
				var autoTiming = activeSlide.attr( "data-snapper-autoplay" ) || $self.attr( "data-snapper-autoplay" );
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

			var scrolling;
			$slider.bind("scroll", function(){
				window.clearTimeout(scrolling);
				scrolling = setTimeout(function(){
					updateSort( $slider[0] );
					setArrowState( $self );
				},66);
			});

			updateSort( $slider[0] );
			
			setArrowState( $self );

			autoplay( getAutoplayInterval() );
			$self.attr("data-" + pluginName + "-enhanced", true);
		});

		return (innerResult !== undefined ? innerResult : result);
	};
}( this, jQuery ));
