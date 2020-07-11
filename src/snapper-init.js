/* snapper css snap points carousel */

;(function(){
	// auto-init on enhance
	document.addEventListener( "enhance", function( e ){
		snapper(e.target.querySelectorAll( ".snapper" ));
	});
}());
