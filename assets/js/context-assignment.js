/*! Windows Blogs - v0.0.1
 * http://10up.com
 * Copyright (c) 2016; * Licensed GPLv2+ */
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
