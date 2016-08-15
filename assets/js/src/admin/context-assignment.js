/**
 * Scripting for context term assignment on the post edit page.
 *
 * @package Microsoft\Windows\Blogs
 * @author  10up
 */

( function ( $ ) {
	'use strict';

	var $list = $( document.getElementById( 'new-tag-ms-context' ) );

	if ( ! $.fn.select2 ) {
		return;
	}

	$list.select2( {
		placeholder: msContextAssignment.placeholder
	} );

} ( jQuery, undefined ) );
