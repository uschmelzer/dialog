(function( w, $ ){
  var Dialog = w.componentNamespace.Dialog, doc = document;

	$.fn.dialog = function(){
		return this.each(function(){
			var $el = $( this ), dialog = new Dialog( this );

			$el.data( "instance", dialog );

			$el.addClass( Dialog.classes.content )
				.attr( "role", "dialog" )
				.attr( "tabindex", 0 )
				.bind( Dialog.events.open, function(){
					dialog.open();
				})
				.bind( Dialog.events.close, function(){
					dialog.close();
				})
				.bind( "click", function( e ){
					if( $(e.target).closest(Dialog.selectors.close).length ){
						e.preventDefault();
						dialog.close();
					}
				});

			dialog.$background.bind( "click", function() {
				dialog.close();
			});

			// close on hashchange if open (supports back button closure)
			$( w ).bind( "hashchange", function(){
				var hash = w.location.hash.replace( "#", "" );

				if( hash !== dialog.hash ){
					dialog.close();
				}
			});

			// open on matching a[href=#id] click
			$( doc ).bind( "click", function( e ){
				var $matchingDialog, $a;

				$a = $( e.target ).closest( "a" );

				if( $a.length && $a.attr( "href" ) ){

					// catch invalid selector exceptions
					try {
						$matchingDialog = $( $a.attr( "href" ) );
					} catch ( error ) {
						// TODO should check the type of exception, it's not clear how well
						//      the error name "SynatxError" is supported
						return;
					}

					if( $matchingDialog.length && $matchingDialog.is( $el ) ){
						$matchingDialog.data( "instance" ).open( $a );
						e.preventDefault();
					}
				}
			});

			// close on escape key
			$( doc ).bind( "keyup", function( e ){
				if( e.which === 27 ){
					dialog.close();
				}
			});
		});
	};

	// auto-init
	$(document).bind("enhance", function(e){
		$( e.target ).find( ".dialog" ).dialog();
	});
}( this, window.jQuery ));
