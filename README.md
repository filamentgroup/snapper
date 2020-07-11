# snapper

A CSS Snap-Points based carousel (and lightweight polyfill)

MIT License
[c] 2020 Filament Group, Inc

## Dependencies
- Intersection Observer Polyfill. Run `$ npm install` to download a copy to  `./node_modules/intersection-observer/intersection-observer.js`

## Demo

<a href="https://fg-snapper.netlify.app/demo/">View the Snapper demos</a>


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
document.addEventListener("DOMContentLoaded", function() {
    document.dispatchEvent(new Event('enhance'));
});
```

or with jQuery:

``` js
$( function(){
    $( document ).trigger( "enhance" );
});
```

Alternatively, you can enhance a selection of carousel(s) manually:
``` js
snapper(document.querySelectorAll('.snapper'));
```

or with jQuery:
``` js
$('.snapper').snapper();
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

If you want to show more than one snapper item at a time, you can set the widths on `.snapper_item` elements. You can aslo adjust widths as viewport width changes. For backwards compatibility, we recommend adding a `scroll-snap-points-x` rule on the `.snapper_pane` that matches the widths. As shown below.

``` css
@media (min-width: 30em){
    .snapper_pane {
        scroll-snap-points-x: repeat(50%);
    }
    .snapper_item {
        width: 50%;
    }
}
```


### Showing partial image reveals

Just as the above specifies, you can use widths to reveal part of the next image to show there's more to scroll.


``` css
@media (min-width: 30em){
    .snapper_pane {
        scroll-snap-points-x: repeat(45%);
    }
    .snapper_item {
        width: 45%;
    }
}
```


### Looping (*experimental)

To make a snapper loop endlessly in either direction, you can add the data-snapper-loop attribute. This feature is experimental in this release.


``` html
<div class="snapper" data-snapper-loop>
    ...
</div>
```


### Methods

The carousel provides the following methods:

| name       | description                       | returns | argument |
| ---------- | --------------------------------- | ------- | -------- |
| `goto`     | scroll to item by index           |         | integer  |
| `getIndex` | get the index of the current item | integer |          |

They can be invoked using plain JavaScript:
``` js
snapper(document.querySelector('.snapper'), 'methodName', 'methodArgument');
```

or using jQuery:
``` js
$('.snapper').snapper('methodName', 'methodArgument');
```


### Events

The carousel dispatches the following events:

| name                 | description                                   |
| -------------------- | --------------------------------------------- |
| `snapper.after-next` | when navigating to next item                  |
| `snapper.after-prev` | when navigating to previous item              |
| `snapper.active`     | fired by carousel item which becomes active   |
| `snapper.inactive`   | fired by carousel item which becomes inactive |


This is how you can listen to them using plain JavaScript:
``` js
document.querySelector('.snapper').addEventListener('snapper.xyz', event => {
    ...
});
```

or using jQuery:
``` js
$('.snapper').on('snapper.xyz', event => {
    ...
});
```


## Changes in 4.0x

Version 4.0 breaks a few features and changes the way snapper works. Some notes on that:

- The HTML is largely the same
- Fake snapping is no longer supported. If a browser doesn't support CSS scroll snap, it won't happen, but the scrolling will still work.
- Snap and scroll related events no longer fire. This is because we no longer support polyfilled snapping. The goto, next, prev events remain as they were.
- Active state is tracked via intersection observer for performance reasons. 
- A "snapper.active" and "snapper.inactive" event is fired whenever snapper items become one or the other.
- Endless looping is optionally available as an experimental feature. Accessibility impact is TBD on this feature.
- CSS now uses flexbox, not floats. This means the JS can do less work calculating widths. You can set the widths on snapper item elements directly now instead of worrying about calculated total widths on the parent. If you set widths on the parent, it'll likely conflict with this. Instead, just set desired widths on the items.


### Support

CSS Scroll Snap support can be found here: [CSS Snap Points on Caniuse.com](http://caniuse.com/#feat=css-snappoints)
This plugin is tested to work broadly across modern browsers, and as long as you use thumbnail navigation. Various features may not work as well across older browsers, such as those that do not support snapping, but scroller content will still be accessible.
