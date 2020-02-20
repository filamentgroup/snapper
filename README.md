# snapper

A CSS Snap-Points based carousel (and lightweight polyfill)

MIT License
[c] 2015 Filament Group, Inc

## Dependencies
- jQuery or similar DOM library
- The toss() extension (optional, for smoothened anchoring and scroll snapping). Run `$ npm install` to download a copy to  `./node_modules/fg-toss/src/toss.js`

## Demo

View the Snapper demos:
* <a href="https://fg-snapper.netlify.com/demo/">Basic example with minimal controls</a>
* <a href="https://fg-snapper.netlify.com/demo/nextprev.html">Next/Prev nav buttons + dot nav</a>
* <a href="https://fg-snapper.netlify.com/demo/breakpoints.html">Multi-image with responsive breakpoints</a>


## Docs

1. Include dependencies, plus the css and js files in the src dir.
2. Use the  markup pattern below.

``` html
<div class="snapper">
	<div class="snapper_pane">
		<div class="snapper_items">
			<div class="snapper_item" id="img-a">
				<img src="a-image.jpg" alt="">
			</div>
			<div class="snapper_item" id="img-b">
				<img src="b-image.jpg" alt="">
			</div>
			<div class="snapper_item" id="img-c">
				<img src="c-image.jpg" alt="">
			</div>
			<div class="snapper_item" id="img-d">
				<img src="d-image.jpg" alt="">
			</div>
		</div>
	</div>
</div>
```

3. Trigger an "enhance" event on a parent of the markup to initialize. You might do this on domready, as shown below:

``` js
$( function(){
	$( document ).trigger( "enhance" );
});
```

### Adding thumbnails

To add thumbnail or graphic navigation to the carousel, you can append the following markup to the end of the snapper div (substituting your own styles, images, and hrefs to correspond to the IDs of their associated slides):

``` html
<div class="snapper_nav">
	<a href="#img-a"><img src="a-thumb.jpg" alt=""></a>
	<a href="#img-b"><img src="b-thumb.jpg" alt=""></a>
	<a href="#img-c"><img src="c-thumb.jpg" alt=""></a>
	<a href="#img-d"><img src="d-thumb.jpg" alt=""></a>
</div>
```

### Adding next/prev navigation

To add next and previous links that persist state, you can add a `data-snapper-nextprev` attribute to the snapper div.

``` html
<div class="snapper" data-snapper-nextprev>
	...
</div>
```

### Showing multiple images at a time

To make snapper respect the CSS-specified widths of items in a slider, you can add the `data-snapper-setwidths` attribute to the snapper div. This allows you to show more than one image at a time, and even adjust that as viewport width allows. See example: https://fg-snapper.netlify.com/demo/breakpoints.html

``` html
<div class="snapper" data-snapper-setwidths>
	...
</div>
```

### Hiding the scrollbar

In some browsers, native scrollbar handles can be pretty ugly across the bottom of the carousel. As long as you're using thumbnails or some means of advancing the slides, you can wrap the `snapper_pane` in a `div` with a class of `snapper_pane_crop` and it'll hide the scrollbar from sight.

``` html
<div class="snapper">
	<div class="snapper_pane_crop">
		<div class="snapper_pane">
			<div class="snapper_items">
				<div class="snapper_item" id="img-a">
					<img src="a-image.jpg" alt="">
				</div>
				<div class="snapper_item" id="img-b">
					...
				</div>
				<div class="snapper_item" id="img-c">
					...
				</div>
				<div class="snapper_item" id="img-d">
					...
				</div>
			</div>
		</div>
	</div>
	<div class="snapper_nav">
		<a href="#img-a"><img src="a-thumb.jpg" alt=""></a>
		<a href="#img-b"><img src="b-thumb.jpg" alt=""></a>
		<a href="#img-c"><img src="c-thumb.jpg" alt=""></a>
		<a href="#img-d"><img src="d-thumb.jpg" alt=""></a>
	</div>
</div>
```

### Support

CSS Snap Points support can be found here: [CSS Snap Points on Caniuse.com](http://caniuse.com/#feat=css-snappoints)
This plugin is tested to work broadly across modern browsers, and as long as you use thumbnail navigation, it will even work in browsers that do not support overflow scrolling properly (such as Android 2.x browser).
