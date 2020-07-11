/* snapper css snap points carousel */
; (function () {
	var pluginName = "snapper";
	var navActiveClass = `${pluginName}_nav_item-selected`;
	window[pluginName] = plugin;
	hasjQuery = window.jQuery !== undefined && window.jQuery.fn !== undefined;
	if (hasjQuery) {
		window.jQuery.fn[ pluginName ] = plugin;
	}
	
	function plugin(firstParam, secondParam) {
		var usesjQuery = !Object.prototype.isPrototypeOf.call(NodeList.prototype, firstParam)
		var elements = usesjQuery
			? Array.from(this)
			: firstParam;
		var optionsOrMethod = usesjQuery ? firstParam : secondParam;
		var pluginArgs = arguments;

		function observerCallback(entries) {
			var parentElem = entries[0].target.closest(`.${pluginName}`);
			var navElem = parentElem.querySelector(`.${pluginName}_nav`);
			for (var i in entries) {
				var entry = entries[i];
				var entryNavLink = parentElem.querySelector(`a[href="#${entry.target.id}"]`);
				if (entry.isIntersecting && entry.intersectionRatio >= .75) {
					entry.target.classList.add(`${pluginName}_item-active`);
					entry.target.dispatchEvent(new CustomEvent(`${pluginName}.active`, { bubbles: true }));
					if (hasjQuery) {
						$(entry.target).trigger(`${pluginName}.active`);
					}
					if (navElem) {
						entryNavLink.classList.add(navActiveClass);
						if (navElem.scrollTo) {
							navElem.scrollTo({ left: entryNavLink.offsetLeft, behavior: "smooth" });
						}
						else {
							navElem.scrollLeft = entryNavLink.offsetLeft;
						}
					}
				}
				else {
					entry.target.classList.remove(`${pluginName}_item-active`);
					entry.target.dispatchEvent(new CustomEvent(`${pluginName}.inactive`, { bubbles: true }));
					if (hasjQuery) {
						$(entry.target).trigger(`${pluginName}.inactive`);
					}
					if (entryNavLink) {
						entryNavLink.classList.remove(navActiveClass);
					}
				}
			}
		}

		function observeItems(elem) {
			var observer = new IntersectionObserver(observerCallback, { root: elem, threshold: .75 });
			elem.querySelectorAll(`.${pluginName}_item`).forEach(function (el) {
				observer.observe(el);
			});
			observer.takeRecords();
		}

		// get the snapper_item elements whose left offsets fall within the scroll pane.
		function activeItems(elem) {
			return elem.querySelectorAll(`.${pluginName}_item-active`);
		}

		// sort an item to either end to ensure there's always something to advance to
		function updateSort(el) {
			if (!el.closest("[data-snapper-loop], [data-loop]")) {
				return;
			}
			var scrollWidth = el.scrollWidth;
			var scrollLeft = el.scrollLeft;
			var contain = el.querySelector(`.${pluginName}_items`);
			var items = contain.children;
			var width = el.offsetWidth;

			if (scrollLeft < width) {
				var sortItem = items.length && items[items.length - 1];
				var sortItemWidth = sortItem.clientWidth;
				contain.prepend(sortItem);
				el.scrollLeft = scrollLeft + sortItemWidth;
			}
			else if (scrollWidth - scrollLeft - width <= 0) {
				var sortItem = items.length && items[0];
				var sortItemWidth = sortItem.clientWidth;
				contain.append(sortItem);
				el.scrollLeft = scrollLeft - sortItemWidth;
			}
		}

		// disable or enable snapper arrows depending on whether they can advance
		function setArrowState(el) {
			// old api helper here. 
			if (el.closest("[data-snapper-loop], [data-loop]")) {
				return;
			}
			var pane = el.querySelector(".snapper_pane");
			var nextLink = el.querySelector(".snapper_nextprev_next");
			var prevLink = el.querySelector(".snapper_nextprev_prev");
			var currScroll = pane.scrollLeft;
			var scrollWidth = pane.scrollWidth;
			var width = pane.clientWidth;

			var noScrollAvailable = (width === scrollWidth);

			var maxScroll = scrollWidth - width;
			if (nextLink) {
				if (currScroll >= maxScroll - 3 || noScrollAvailable) { // 3 here is arbitrary tolerance
					nextLink.classList.add("snapper_nextprev-disabled");
					nextLink.setAttribute("tabindex", -1);
				} else {
					nextLink.classList.remove("snapper_nextprev-disabled");
					nextLink.setAttribute("tabindex", 0);
				}
			}

			if (prevLink) {
				if (currScroll > 3 && !noScrollAvailable) { // 3 is arbitrary tolerance
					prevLink.classList.remove("snapper_nextprev-disabled")
					prevLink.setAttribute("tabindex", 0);
				} else {
					prevLink.classList.add("snapper_nextprev-disabled");
					prevLink.setAttribute("tabindex", -1);
				}
			}

			if (noScrollAvailable) {
				el.classList.add("snapper-hide-nav");
			}
			else {
				el.classList.remove("snapper-hide-nav");
			}
		}

		function goto(elem, x, callback) {
			if (elem.scrollTo) {
				elem.scrollTo({ left: x, behavior: "smooth" });
			}
			else {
				elem.scrollLeft = x;
			}
			var activeSlides = activeItems(elem);

			elem.closest('.snapper').dispatchEvent(new CustomEvent(`${pluginName}.after-goto`, { bubbles: true }), {
				activeSlides: activeSlides[0]
			});
			if (hasjQuery) {
				$(elem.closest('.snapper')).trigger(`${pluginName}.after-goto`);
			}
			if (callback) {
				callback();
			};
		}

		var innerResult;

		// Loop through snapper elements and enhance/bind events
		elements.forEach(function (snap) {
			if (innerResult !== undefined) {
				return;
			}

			var self = snap;
			var addNextPrev = snap.hasAttribute(`data-${pluginName}-nextprev`);
			var autoTimeout;
			var slider = snap.querySelector(`.${pluginName}_pane`)
			// give the pane a tabindex for arrow key handling
			slider.setAttribute("tabindex", "0");
			var items = slider.querySelector(`.${pluginName}_items`)

			for (var item of items.children) {
				// make sure items are ID'd. This is critical for arrow nav and sorting.
				if (item.getAttribute("id") === undefined) {
					item.setAttribute("id", new Date().getTime());
				}
				item.classList.add(`${pluginName}_item`)
			}

			if (typeof optionsOrMethod === "string") {
				var args = usesjQuery ? pluginArgs : Array.prototype.slice.call(pluginArgs, 1);
				var index;

				switch (optionsOrMethod) {
					case "goto":
						index = args[1] % items.children.length;

						var offset = items.children[index].offsetLeft;
						goto(slider, offset, function () {
							// invoke the callback if it was supplied
							if (typeof args[1] === "function") {
								args[1]();
							}
						});
						break;
					case "getIndex":
						var currentItem = activeItems(slider)[0];
						innerResult = Array.from(currentItem.parentElement.children).findIndex(child => child === currentItem)
						break;
				}
				return;
			}

			// avoid double enhance activities
			if (snap.getAttribute(`data-${pluginName}-enhanced`)) {
				return;
			}

			observeItems(slider);

			// if the nextprev option is set, add the nextprev nav
			if (addNextPrev) {
				var nextprev = document.createElement('ul');
				nextprev.classList.add('snapper_nextprev');
				nextprev.innerHTML = '<li class="snapper_nextprev_item"><a href="#prev" class="snapper_nextprev_prev">Prev</a></li><li class="snapper_nextprev_item"><a href="#next" class="snapper_nextprev_next">Next</a></li>';
				var nextprevContain = self.querySelector(".snapper_nextprev_contain");
				if (!nextprevContain) {
					nextprevContain = self;
				}
				nextprevContain.appendChild(nextprev);
			}

			// This click binding will allow linking to slides from thumbnails without causing the page to scroll to the carousel container
			// this also supports click handling for generated next/prev links
			snap.querySelectorAll("a").forEach(el => {
				el.addEventListener("click", function (e) {
					clearTimeout(autoTimeout);
					var slideID = this.getAttribute("href");

					if (this.classList.contains("snapper_nextprev_next")) {
						e.preventDefault();
						return arrowNavigate(true);
					}
					else if (this.classList.contains("snapper_nextprev_prev")) {
						e.preventDefault();
						return arrowNavigate(false);
					}
					// internal links to slides
					else if (slideID.indexOf("#") === 0 && slideID.length > 1) {
						e.preventDefault();
						gotoSlide(slideID);
					}
				});
			});

			// arrow key bindings for next/prev
			snap.addEventListener("keydown", function (e) {
				if (e.keyCode === 37 || e.keyCode === 38) {
					clearTimeout(autoTimeout);
					e.preventDefault();
					e.stopImmediatePropagation();
					arrowNavigate(false);
				}
				if (e.keyCode === 39 || e.keyCode === 40) {
					clearTimeout(autoTimeout);
					e.preventDefault();
					e.stopImmediatePropagation();
					arrowNavigate(true);
				}
			});

			function gotoSlide(href, callback) {
				var slide = self.querySelector(href);
				if (slide) {
					goto(slider, slide.offsetLeft, function () {
						if (callback) {
							callback();
						}
					});
				}
			}



			var afterResize;
			var currSlide;
			function resizeUpdates() {
				clearTimeout(afterResize);
				if (!currSlide) {
					currSlide = activeItems(slider).length && activeItems(slider)[0];
				}
				afterResize = setTimeout(function () {
					// retain snapping on resize 
					gotoSlide(currSlide.getAttribute("id"));
					currSlide = null;
					// resize can reveal or hide slides, so update arrows
					setArrowState(self);
				}, 300);
			}
			window.addEventListener("resize", resizeUpdates);

			// next/prev links or arrows should loop back to the other end when an extreme is reached
			function arrowNavigate(forward) {
				if (forward) {
					next();
				}
				else {
					prev();
				}
			}

			// advance slide one full scrollpane's width forward
			function next() {
				var currentActive = activeItems(slider).length && activeItems(slider)[0];
				var next = currentActive.nextElementSibling;
				if (next) {
					gotoSlide(`#${next.getAttribute("id")}`, function () {
						snap.dispatchEvent(new CustomEvent(`${pluginName}.after-next`, { bubbles: true }));
						if (hasjQuery) {
							$(snap).trigger(`${pluginName}.after-next`);
						}
					});
				}
			}

			// advance slide one full scrollpane's width backwards
			function prev() {
				var currentActive = activeItems(slider).length && activeItems(slider)[0];
				var prev = currentActive.previousElementSibling;
				if (prev) {
					gotoSlide(`#${prev.getAttribute("id")}`, function () {
						snap.dispatchEvent(new CustomEvent(`${pluginName}.after-prev`, { bubbles: true }));
						if (hasjQuery) {
							$(snap).trigger(`${pluginName}.after-prev`);
						}
					});
				}
			}

			function getAutoplayInterval() {
				var currentActive = activeItems(slider)
				var activeSlide = currentActive.length && currentActive[currentActive.length - 1];
				var autoTiming = activeSlide && activeSlide.getAttribute("data-snapper-autoplay") || self.getAttribute("data-snapper-autoplay");
				if (autoTiming) {
					autoTiming = parseInt(autoTiming, 10) || 5000;
				}
				return autoTiming;
			}

			// if the `data-autoplay` attribute is assigned a natural number value
			// use it to make the slides cycle until there is a user interaction
			function autoplay(autoTiming) {
				if (autoTiming) {
					// autoTimeout is cleared in each user interaction binding
					autoTimeout = setTimeout(function () {
						var timeout = getAutoplayInterval();
						if (timeout) {
							arrowNavigate(true);
							autoplay(timeout);
						}
					}, autoTiming);
				}
			}

			// if a touch event is fired on the snapper we know the user is trying to
			// interact with it and we should disable the auto play
			["pointerdown", "click", "mouseenter", "focus"].forEach(eventType => {
				slider.addEventListener(eventType, function () {
					clearTimeout(autoTimeout);
				});
			});

			var scrolling;
			slider.addEventListener("scroll", function () {
				window.clearTimeout(scrolling);
				scrolling = setTimeout(function () {
					updateSort(slider);
					setArrowState(self);
				}, 66);
			});

			updateSort(slider);

			setArrowState(self);

			autoplay(getAutoplayInterval());
			self.setAttribute(`data-${pluginName}-enhanced`, true);
		});


		return innerResult !== undefined
			? innerResult
			: (usesjQuery ? this : elements);
	};
}());
