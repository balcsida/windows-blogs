/*! Windows Blogs - v0.0.1
 * http://10up.com
 * Copyright (c) 2016; * Licensed GPLv2+ */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

;(function( $ ){

  'use strict';

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement("div");
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        'iframe[src*="player.vimeo.com"]',
        'iframe[src*="youtube.com"]',
        'iframe[src*="youtube-nocookie.com"]',
        'iframe[src*="kickstarter.com"][src*="video.html"]',
        'object',
        'embed'
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not('object object'); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(count){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + count;
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+'%');
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/*! Picturefill - v2.3.1 - 2015-04-09
* http://scottjehl.github.io/picturefill
* Copyright (c) 2015 https://github.com/scottjehl/picturefill/blob/master/Authors.txt; Licensed MIT */
/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas, David Knight. Dual MIT/BSD license */

window.matchMedia || (window.matchMedia = function() {
	"use strict";

	// For browsers that support matchMedium api such as IE 9 and webkit
	var styleMedia = (window.styleMedia || window.media);

	// For those that don't support matchMedium
	if (!styleMedia) {
		var style       = document.createElement('style'),
			script      = document.getElementsByTagName('script')[0],
			info        = null;

		style.type  = 'text/css';
		style.id    = 'matchmediajs-test';

		script.parentNode.insertBefore(style, script);

		// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
		info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

		styleMedia = {
			matchMedium: function(media) {
				var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

				// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
				if (style.styleSheet) {
					style.styleSheet.cssText = text;
				} else {
					style.textContent = text;
				}

				// Test if media query is true or false
				return info.width === '1px';
			}
		};
	}

	return function(media) {
		return {
			matches: styleMedia.matchMedium(media || 'all'),
			media: media || 'all'
		};
	};
}());
/*! Picturefill - Responsive Images that work today.
*  Author: Scott Jehl, Filament Group, 2012 ( new proposal implemented by Shawn Jansepar )
*  License: MIT/GPLv2
*  Spec: http://picture.responsiveimages.org/
*/
(function( w, doc, image ) {
	// Enable strict mode
	"use strict";

	function expose(picturefill) {
		/* expose picturefill */
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// CommonJS, just export
			module.exports = picturefill;
		} else if ( typeof define === "function" && define.amd ) {
			// AMD support
			define( "picturefill", function() { return picturefill; } );
		}
		if ( typeof w === "object" ) {
			// If no AMD and we are in the browser, attach to window
			w.picturefill = picturefill;
		}
	}

	// If picture is supported, well, that's awesome. Let's get outta here...
	if ( w.HTMLPictureElement ) {
		expose(function() { });
		return;
	}

	// HTML shim|v it for old IE (IE9 will still need the HTML video tag workaround)
	doc.createElement( "picture" );

	// local object for method references and testing exposure
	var pf = w.picturefill || {};

	var regWDesc = /\s+\+?\d+(e\d+)?w/;

	// namespace
	pf.ns = "picturefill";

	// srcset support test
	(function() {
		pf.srcsetSupported = "srcset" in image;
		pf.sizesSupported = "sizes" in image;
		pf.curSrcSupported = "currentSrc" in image;
	})();

	// just a string trim workaround
	pf.trim = function( str ) {
		return str.trim ? str.trim() : str.replace( /^\s+|\s+$/g, "" );
	};

	/**
	 * Gets a string and returns the absolute URL
	 * @param src
	 * @returns {String} absolute URL
	 */
	pf.makeUrl = (function() {
		var anchor = doc.createElement( "a" );
		return function(src) {
			anchor.href = src;
			return anchor.href;
		};
	})();

	/**
	 * Shortcut method for https://w3c.github.io/webappsec/specs/mixedcontent/#restricts-mixed-content ( for easy overriding in tests )
	 */
	pf.restrictsMixedContent = function() {
		return w.location.protocol === "https:";
	};
	/**
	 * Shortcut method for matchMedia ( for easy overriding in tests )
	 */

	pf.matchesMedia = function( media ) {
		return w.matchMedia && w.matchMedia( media ).matches;
	};

	// Shortcut method for `devicePixelRatio` ( for easy overriding in tests )
	pf.getDpr = function() {
		return ( w.devicePixelRatio || 1 );
	};

	/**
	 * Get width in css pixel value from a "length" value
	 * http://dev.w3.org/csswg/css-values-3/#length-value
	 */
	pf.getWidthFromLength = function( length ) {
		var cssValue;
		// If a length is specified and doesn’t contain a percentage, and it is greater than 0 or using `calc`, use it. Else, abort.
        if ( !(length && length.indexOf( "%" ) > -1 === false && ( parseFloat( length ) > 0 || length.indexOf( "calc(" ) > -1 )) ) {
            return false;
        }

		/**
		 * If length is specified in  `vw` units, use `%` instead since the div we’re measuring
		 * is injected at the top of the document.
		 *
		 * TODO: maybe we should put this behind a feature test for `vw`? The risk of doing this is possible browser inconsistancies with vw vs %
		 */
		length = length.replace( "vw", "%" );

		// Create a cached element for getting length value widths
		if ( !pf.lengthEl ) {
			pf.lengthEl = doc.createElement( "div" );

			// Positioning styles help prevent padding/margin/width on `html` or `body` from throwing calculations off.
			pf.lengthEl.style.cssText = "border:0;display:block;font-size:1em;left:0;margin:0;padding:0;position:absolute;visibility:hidden";

			// Add a class, so that everyone knows where this element comes from
			pf.lengthEl.className = "helper-from-picturefill-js";
		}

		pf.lengthEl.style.width = "0px";

        try {
		    pf.lengthEl.style.width = length;
        } catch ( e ) {}

		doc.body.appendChild(pf.lengthEl);

		cssValue = pf.lengthEl.offsetWidth;

		if ( cssValue <= 0 ) {
			cssValue = false;
		}

		doc.body.removeChild( pf.lengthEl );

		return cssValue;
	};

    pf.detectTypeSupport = function( type, typeUri ) {
        // based on Modernizr's lossless img-webp test
        // note: asynchronous
        var image = new w.Image();
        image.onerror = function() {
            pf.types[ type ] = false;
            picturefill();
        };
        image.onload = function() {
            pf.types[ type ] = image.width === 1;
            picturefill();
        };
        image.src = typeUri;

        return "pending";
    };
	// container of supported mime types that one might need to qualify before using
	pf.types = pf.types || {};

	pf.initTypeDetects = function() {
        // Add support for standard mime types
        pf.types[ "image/jpeg" ] = true;
        pf.types[ "image/gif" ] = true;
        pf.types[ "image/png" ] = true;
        pf.types[ "image/svg+xml" ] = doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        pf.types[ "image/webp" ] = pf.detectTypeSupport("image/webp", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=");
    };

	pf.verifyTypeSupport = function( source ) {
		var type = source.getAttribute( "type" );
		// if type attribute exists, return test result, otherwise return true
		if ( type === null || type === "" ) {
			return true;
		} else {
				var pfType = pf.types[ type ];
			// if the type test is a function, run it and return "pending" status. The function will rerun picturefill on pending elements once finished.
			if ( typeof pfType === "string" && pfType !== "pending") {
				pf.types[ type ] = pf.detectTypeSupport( type, pfType );
				return "pending";
			} else if ( typeof pfType === "function" ) {
				pfType();
				return "pending";
			} else {
				return pfType;
			}
		}
	};

	// Parses an individual `size` and returns the length, and optional media query
	pf.parseSize = function( sourceSizeStr ) {
		var match = /(\([^)]+\))?\s*(.+)/g.exec( sourceSizeStr );
		return {
			media: match && match[1],
			length: match && match[2]
		};
	};

	// Takes a string of sizes and returns the width in pixels as a number
	pf.findWidthFromSourceSize = function( sourceSizeListStr ) {
		// Split up source size list, ie ( max-width: 30em ) 100%, ( max-width: 50em ) 50%, 33%
		//                            or (min-width:30em) calc(30% - 15px)
		var sourceSizeList = pf.trim( sourceSizeListStr ).split( /\s*,\s*/ ),
			winningLength;

		for ( var i = 0, len = sourceSizeList.length; i < len; i++ ) {
			// Match <media-condition>? length, ie ( min-width: 50em ) 100%
			var sourceSize = sourceSizeList[ i ],
				// Split "( min-width: 50em ) 100%" into separate strings
				parsedSize = pf.parseSize( sourceSize ),
				length = parsedSize.length,
				media = parsedSize.media;

			if ( !length ) {
				continue;
			}
			// if there is no media query or it matches, choose this as our winning length
			if ( (!media || pf.matchesMedia( media )) &&
				// pass the length to a method that can properly determine length
				// in pixels based on these formats: http://dev.w3.org/csswg/css-values-3/#length-value
				(winningLength = pf.getWidthFromLength( length )) ) {
				break;
			}
		}

		//if we have no winningLength fallback to 100vw
		return winningLength || Math.max(w.innerWidth || 0, doc.documentElement.clientWidth);
	};

	pf.parseSrcset = function( srcset ) {
		/**
		 * A lot of this was pulled from Boris Smus’ parser for the now-defunct WHATWG `srcset`
		 * https://github.com/borismus/srcset-polyfill/blob/master/js/srcset-info.js
		 *
		 * 1. Let input (`srcset`) be the value passed to this algorithm.
		 * 2. Let position be a pointer into input, initially pointing at the start of the string.
		 * 3. Let raw candidates be an initially empty ordered list of URLs with associated
		 *    unparsed descriptors. The order of entries in the list is the order in which entries
		 *    are added to the list.
		 */
		var candidates = [];

		while ( srcset !== "" ) {
			srcset = srcset.replace( /^\s+/g, "" );

			// 5. Collect a sequence of characters that are not space characters, and let that be url.
			var pos = srcset.search(/\s/g),
				url, descriptor = null;

			if ( pos !== -1 ) {
				url = srcset.slice( 0, pos );

				var last = url.slice(-1);

				// 6. If url ends with a U+002C COMMA character (,), remove that character from url
				// and let descriptors be the empty string. Otherwise, follow these substeps
				// 6.1. If url is empty, then jump to the step labeled descriptor parser.

				if ( last === "," || url === "" ) {
					url = url.replace( /,+$/, "" );
					descriptor = "";
				}
				srcset = srcset.slice( pos + 1 );

				// 6.2. Collect a sequence of characters that are not U+002C COMMA characters (,), and
				// let that be descriptors.
				if ( descriptor === null ) {
					var descpos = srcset.indexOf( "," );
					if ( descpos !== -1 ) {
						descriptor = srcset.slice( 0, descpos );
						srcset = srcset.slice( descpos + 1 );
					} else {
						descriptor = srcset;
						srcset = "";
					}
				}
			} else {
				url = srcset;
				srcset = "";
			}

			// 7. Add url to raw candidates, associated with descriptors.
			if ( url || descriptor ) {
				candidates.push({
					url: url,
					descriptor: descriptor
				});
			}
		}
		return candidates;
	};

	pf.parseDescriptor = function( descriptor, sizesattr ) {
		// 11. Descriptor parser: Let candidates be an initially empty source set. The order of entries in the list
		// is the order in which entries are added to the list.
		var sizes = sizesattr || "100vw",
			sizeDescriptor = descriptor && descriptor.replace( /(^\s+|\s+$)/g, "" ),
			widthInCssPixels = pf.findWidthFromSourceSize( sizes ),
			resCandidate;

			if ( sizeDescriptor ) {
				var splitDescriptor = sizeDescriptor.split(" ");

				for (var i = splitDescriptor.length - 1; i >= 0; i--) {
					var curr = splitDescriptor[ i ],
						lastchar = curr && curr.slice( curr.length - 1 );

					if ( ( lastchar === "h" || lastchar === "w" ) && !pf.sizesSupported ) {
						resCandidate = parseFloat( ( parseInt( curr, 10 ) / widthInCssPixels ) );
					} else if ( lastchar === "x" ) {
						var res = curr && parseFloat( curr, 10 );
						resCandidate = res && !isNaN( res ) ? res : 1;
					}
				}
			}
		return resCandidate || 1;
	};

	/**
	 * Takes a srcset in the form of url/
	 * ex. "images/pic-medium.png 1x, images/pic-medium-2x.png 2x" or
	 *     "images/pic-medium.png 400w, images/pic-medium-2x.png 800w" or
	 *     "images/pic-small.png"
	 * Get an array of image candidates in the form of
	 *      {url: "/foo/bar.png", resolution: 1}
	 * where resolution is http://dev.w3.org/csswg/css-values-3/#resolution-value
	 * If sizes is specified, resolution is calculated
	 */
	pf.getCandidatesFromSourceSet = function( srcset, sizes ) {
		var candidates = pf.parseSrcset( srcset ),
			formattedCandidates = [];

		for ( var i = 0, len = candidates.length; i < len; i++ ) {
			var candidate = candidates[ i ];

			formattedCandidates.push({
				url: candidate.url,
				resolution: pf.parseDescriptor( candidate.descriptor, sizes )
			});
		}
		return formattedCandidates;
	};

	/**
	 * if it's an img element and it has a srcset property,
	 * we need to remove the attribute so we can manipulate src
	 * (the property's existence infers native srcset support, and a srcset-supporting browser will prioritize srcset's value over our winning picture candidate)
	 * this moves srcset's value to memory for later use and removes the attr
	 */
	pf.dodgeSrcset = function( img ) {
		if ( img.srcset ) {
			img[ pf.ns ].srcset = img.srcset;
			img.srcset = "";
			img.setAttribute( "data-pfsrcset", img[ pf.ns ].srcset );
		}
	};

	// Accept a source or img element and process its srcset and sizes attrs
	pf.processSourceSet = function( el ) {
		var srcset = el.getAttribute( "srcset" ),
			sizes = el.getAttribute( "sizes" ),
			candidates = [];

		// if it's an img element, use the cached srcset property (defined or not)
		if ( el.nodeName.toUpperCase() === "IMG" && el[ pf.ns ] && el[ pf.ns ].srcset ) {
			srcset = el[ pf.ns ].srcset;
		}

		if ( srcset ) {
			candidates = pf.getCandidatesFromSourceSet( srcset, sizes );
		}
		return candidates;
	};

	pf.backfaceVisibilityFix = function( picImg ) {
		// See: https://github.com/scottjehl/picturefill/issues/332
		var style = picImg.style || {},
			WebkitBackfaceVisibility = "webkitBackfaceVisibility" in style,
			currentZoom = style.zoom;

		if (WebkitBackfaceVisibility) {
			style.zoom = ".999";

			WebkitBackfaceVisibility = picImg.offsetWidth;

			style.zoom = currentZoom;
		}
	};

	pf.setIntrinsicSize = (function() {
		var urlCache = {};
		var setSize = function( picImg, width, res ) {
            if ( width ) {
			    picImg.setAttribute( "width", parseInt(width / res, 10) );
            }
		};
		return function( picImg, bestCandidate ) {
			var img;
			if ( !picImg[ pf.ns ] || w.pfStopIntrinsicSize ) {
				return;
			}
			if ( picImg[ pf.ns ].dims === undefined ) {
				picImg[ pf.ns].dims = picImg.getAttribute("width") || picImg.getAttribute("height");
			}
			if ( picImg[ pf.ns].dims ) { return; }

			if ( bestCandidate.url in urlCache ) {
				setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
			} else {
				img = doc.createElement( "img" );
				img.onload = function() {
					urlCache[bestCandidate.url] = img.width;

                    //IE 10/11 don't calculate width for svg outside document
                    if ( !urlCache[bestCandidate.url] ) {
                        try {
                            doc.body.appendChild( img );
                            urlCache[bestCandidate.url] = img.width || img.offsetWidth;
                            doc.body.removeChild( img );
                        } catch(e){}
                    }

					if ( picImg.src === bestCandidate.url ) {
						setSize( picImg, urlCache[bestCandidate.url], bestCandidate.resolution );
					}
					picImg = null;
					img.onload = null;
					img = null;
				};
				img.src = bestCandidate.url;
			}
		};
	})();

	pf.applyBestCandidate = function( candidates, picImg ) {
		var candidate,
			length,
			bestCandidate;

		candidates.sort( pf.ascendingSort );

		length = candidates.length;
		bestCandidate = candidates[ length - 1 ];

		for ( var i = 0; i < length; i++ ) {
			candidate = candidates[ i ];
			if ( candidate.resolution >= pf.getDpr() ) {
				bestCandidate = candidate;
				break;
			}
		}

		if ( bestCandidate ) {

			bestCandidate.url = pf.makeUrl( bestCandidate.url );

			if ( picImg.src !== bestCandidate.url ) {
				if ( pf.restrictsMixedContent() && bestCandidate.url.substr(0, "http:".length).toLowerCase() === "http:" ) {
					if ( window.console !== undefined ) {
						console.warn( "Blocked mixed content image " + bestCandidate.url );
					}
				} else {
					picImg.src = bestCandidate.url;
					// currentSrc attribute and property to match
					// http://picture.responsiveimages.org/#the-img-element
					if ( !pf.curSrcSupported ) {
						picImg.currentSrc = picImg.src;
					}

					pf.backfaceVisibilityFix( picImg );
				}
			}

			pf.setIntrinsicSize(picImg, bestCandidate);
		}
	};

	pf.ascendingSort = function( a, b ) {
		return a.resolution - b.resolution;
	};

	/**
	 * In IE9, <source> elements get removed if they aren't children of
	 * video elements. Thus, we conditionally wrap source elements
	 * using <!--[if IE 9]><video style="display: none;"><![endif]-->
	 * and must account for that here by moving those source elements
	 * back into the picture element.
	 */
	pf.removeVideoShim = function( picture ) {
		var videos = picture.getElementsByTagName( "video" );
		if ( videos.length ) {
			var video = videos[ 0 ],
				vsources = video.getElementsByTagName( "source" );
			while ( vsources.length ) {
				picture.insertBefore( vsources[ 0 ], video );
			}
			// Remove the video element once we're finished removing its children
			video.parentNode.removeChild( video );
		}
	};

	/**
	 * Find all `img` elements, and add them to the candidate list if they have
	 * a `picture` parent, a `sizes` attribute in basic `srcset` supporting browsers,
	 * a `srcset` attribute at all, and they haven’t been evaluated already.
	 */
	pf.getAllElements = function() {
		var elems = [],
			imgs = doc.getElementsByTagName( "img" );

		for ( var h = 0, len = imgs.length; h < len; h++ ) {
			var currImg = imgs[ h ];

			if ( currImg.parentNode.nodeName.toUpperCase() === "PICTURE" ||
			( currImg.getAttribute( "srcset" ) !== null ) || currImg[ pf.ns ] && currImg[ pf.ns ].srcset !== null ) {
				elems.push( currImg );
			}
		}
		return elems;
	};

	pf.getMatch = function( img, picture ) {
		var sources = picture.childNodes,
			match;

		// Go through each child, and if they have media queries, evaluate them
		for ( var j = 0, slen = sources.length; j < slen; j++ ) {
			var source = sources[ j ];

			// ignore non-element nodes
			if ( source.nodeType !== 1 ) {
				continue;
			}

			// Hitting the `img` element that started everything stops the search for `sources`.
			// If no previous `source` matches, the `img` itself is evaluated later.
			if ( source === img ) {
				return match;
			}

			// ignore non-`source` nodes
			if ( source.nodeName.toUpperCase() !== "SOURCE" ) {
				continue;
			}
			// if it's a source element that has the `src` property set, throw a warning in the console
			if ( source.getAttribute( "src" ) !== null && typeof console !== undefined ) {
				console.warn("The `src` attribute is invalid on `picture` `source` element; instead, use `srcset`.");
			}

			var media = source.getAttribute( "media" );

			// if source does not have a srcset attribute, skip
			if ( !source.getAttribute( "srcset" ) ) {
				continue;
			}

			// if there's no media specified, OR w.matchMedia is supported
			if ( ( !media || pf.matchesMedia( media ) ) ) {
				var typeSupported = pf.verifyTypeSupport( source );

				if ( typeSupported === true ) {
					match = source;
					break;
				} else if ( typeSupported === "pending" ) {
					return false;
				}
			}
		}

		return match;
	};

	function picturefill( opt ) {
		var elements,
			element,
			parent,
			firstMatch,
			candidates,
			options = opt || {};

		elements = options.elements || pf.getAllElements();

		// Loop through all elements
		for ( var i = 0, plen = elements.length; i < plen; i++ ) {
			element = elements[ i ];
			parent = element.parentNode;
			firstMatch = undefined;
			candidates = undefined;

			// immediately skip non-`img` nodes
			if ( element.nodeName.toUpperCase() !== "IMG" ) {
				continue;
			}

			// expando for caching data on the img
			if ( !element[ pf.ns ] ) {
				element[ pf.ns ] = {};
			}

			// if the element has already been evaluated, skip it unless
			// `options.reevaluate` is set to true ( this, for example,
			// is set to true when running `picturefill` on `resize` ).
			if ( !options.reevaluate && element[ pf.ns ].evaluated ) {
				continue;
			}

			// if `img` is in a `picture` element
			if ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) {

				// IE9 video workaround
				pf.removeVideoShim( parent );

				// return the first match which might undefined
				// returns false if there is a pending source
				// TODO the return type here is brutal, cleanup
				firstMatch = pf.getMatch( element, parent );

				// if any sources are pending in this picture due to async type test(s)
				// remove the evaluated attr and skip for now ( the pending test will
				// rerun picturefill on this element when complete)
				if ( firstMatch === false ) {
					continue;
				}
			} else {
				firstMatch = undefined;
			}

			// Cache and remove `srcset` if present and we’re going to be doing `picture`/`srcset`/`sizes` polyfilling to it.
			if ( ( parent && parent.nodeName.toUpperCase() === "PICTURE" ) ||
			( !pf.sizesSupported && ( element.srcset && regWDesc.test( element.srcset ) ) ) ) {
				pf.dodgeSrcset( element );
			}

			if ( firstMatch ) {
				candidates = pf.processSourceSet( firstMatch );
				pf.applyBestCandidate( candidates, element );
			} else {
				// No sources matched, so we’re down to processing the inner `img` as a source.
				candidates = pf.processSourceSet( element );

				if ( element.srcset === undefined || element[ pf.ns ].srcset ) {
					// Either `srcset` is completely unsupported, or we need to polyfill `sizes` functionality.
					pf.applyBestCandidate( candidates, element );
				} // Else, resolution-only `srcset` is supported natively.
			}

			// set evaluated to true to avoid unnecessary reparsing
			element[ pf.ns ].evaluated = true;
		}
	}

	/**
	 * Sets up picture polyfill by polling the document and running
	 * the polyfill every 250ms until the document is ready.
	 * Also attaches picturefill on resize
	 */
	function runPicturefill() {
		pf.initTypeDetects();
		picturefill();
		var intervalId = setInterval( function() {
			// When the document has finished loading, stop checking for new images
			// https://github.com/ded/domready/blob/master/ready.js#L15
			picturefill();

			if ( /^loaded|^i|^c/.test( doc.readyState ) ) {
				clearInterval( intervalId );
				return;
			}
		}, 250 );

		var resizeTimer;
		var handleResize = function() {
	        picturefill({ reevaluate: true });
	    };
		function checkResize() {
		    clearTimeout(resizeTimer);
		    resizeTimer = setTimeout( handleResize, 60 );
		}

		if ( w.addEventListener ) {
			w.addEventListener( "resize", checkResize, false );
		} else if ( w.attachEvent ) {
			w.attachEvent( "onresize", checkResize );
		}
	}

	runPicturefill();

	/* expose methods for testing */
	picturefill._ = pf;

	expose( picturefill );

} )( window, window.document, new window.Image() );

// jQuery HC-Sticky
// =============
// Version: 1.2.43
// Copyright: Some Web Media
// Author: Some Web Guy
// Author URL: http://twitter.com/some_web_guy
// Website: http://someweblog.com/
// Plugin URL: https://github.com/somewebmedia/hc-sticky
// License: Released under the MIT License www.opensource.org/licenses/mit-license.php
// Description: Cross-browser jQuery plugin that makes any element attached to the page and always visible while you scroll.

(function($, window, undefined) {
	"use strict";

	// console.log shortcut
	var log = function(t){console.log(t)};

	var $window = $(window),
		document = window.document,
		$document = $(document);

	// detect IE version
	var ie = (function(){var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i'); while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]){}; return v > 4 ? v : undef})();

	/*----------------------------------------------------
						Global functions
	----------------------------------------------------*/

	// check for scroll direction and speed
	var getScroll = function() {
		var pageXOffset = window.pageXOffset !== undefined ? window.pageXOffset : (document.compatMode == "CSS1Compat" ? window.document.documentElement.scrollLeft : window.document.body.scrollLeft),
			pageYOffset = window.pageYOffset !== undefined ? window.pageYOffset : (document.compatMode == "CSS1Compat" ? window.document.documentElement.scrollTop : window.document.body.scrollTop);

		if (typeof getScroll.x == 'undefined') {
			getScroll.x = pageXOffset;
			getScroll.y = pageYOffset;
		}
		if (typeof getScroll.distanceX == 'undefined') {
			getScroll.distanceX = pageXOffset;
			getScroll.distanceY = pageYOffset;
		} else {
			getScroll.distanceX = pageXOffset - getScroll.x;
			getScroll.distanceY = pageYOffset - getScroll.y;
		}

		var diffX = getScroll.x - pageXOffset,
			diffY = getScroll.y - pageYOffset;

		getScroll.direction = diffX < 0 ? 'right' :
			diffX > 0 ? 'left' :
			diffY <= 0 ? 'down' :
			diffY > 0 ? 'up' : 'first';

		getScroll.x = pageXOffset;
		getScroll.y = pageYOffset;
	};
	$window.on('scroll', getScroll);


	// little original style plugin
	$.fn.style = function(style) {
		if (!style) return null;

		var $this = $(this),
			value;

		// clone element
		var $clone = $this.clone().css('display','none');
		// randomize the name of cloned radio buttons, otherwise selections get screwed
		$clone.find('input:radio').attr('name','copy-' + Math.floor((Math.random()*100)+1));
		// insert clone to DOM
		$this.after($clone);

		var getStyle = function(el, style){
			var val;
			if (el.currentStyle) {
				// replace dashes with capitalized letter, e.g. padding-left to paddingLeft
				val = el.currentStyle[style.replace(/-\w/g, function(s){return s.toUpperCase().replace('-','')})];
			} else if (window.getComputedStyle) {
				val = document.defaultView.getComputedStyle(el,null).getPropertyValue(style);
			}
			// check for margin:auto
			val = (/margin/g.test(style)) ? ((parseInt(val) === $this[0].offsetLeft) ? val : 'auto') : val;
			return val;
		};

		if (typeof style == 'string') {
			value = getStyle($clone[0], style);
		} else {
			value = {};
			$.each(style, function(i, s){
				value[s] = getStyle($clone[0], s);
			});
		}

		// destroy clone
		$clone.remove();

		return value || null;
	};


	/*----------------------------------------------------
						jQuery plugin
	----------------------------------------------------*/

	$.fn.extend({

		hcSticky: function(options) {

			// check if selected element exist in DOM, user doesn't have to worry about that
			if (this.length == 0) return this;

			this.pluginOptions('hcSticky', {
				top: 0,
				bottom: 0,
				bottomEnd: 0,
				innerTop: 0,
				innerSticker: null,
				className: 'sticky',
				wrapperClassName: 'wrapper-sticky',
				stickTo: null,
				responsive: true,
				followScroll: true,
				offResolutions: null,
				onStart: $.noop,
				onStop: $.noop,
				on: true,
				fn: null // used only by the plugin
			}, options || {}, {
				reinit: function(){
					// just call itself again
					$(this).hcSticky();
				},
				stop: function(){
					$(this).pluginOptions('hcSticky', {on: false}).each(function(){
						var $this = $(this),
							options = $this.pluginOptions('hcSticky'),
							$wrapper = $this.parent('.' + options.wrapperClassName);

						// set current position
						var top = $this.offset().top - $wrapper.offset().top;
						$this.css({
							position: 'absolute',
							top: top,
							bottom: 'auto',
							left: 'auto',
							right: 'auto'
						}).removeClass(options.className);
					});
				},
				off: function(){
					$(this).pluginOptions('hcSticky', {on: false}).each(function(){
						var $this = $(this),
							options = $this.pluginOptions('hcSticky'),
							$wrapper = $this.parent('.' + options.wrapperClassName);

						// clear position
						$this.css({
							position: 'relative',
							top: 'auto',
							bottom: 'auto',
							left: 'auto',
							right: 'auto'
						}).removeClass(options.className);

						$wrapper.css('height', 'auto');
					});
				},
				on: function(){
					$(this).each(function(){
						$(this).pluginOptions('hcSticky', {
							on: true,
							remember: {
								offsetTop: $window.scrollTop()
							}
						}).hcSticky();
					});
				},
				destroy: function(){
					var $this = $(this),
						options = $this.pluginOptions('hcSticky'),
						$wrapper = $this.parent('.' + options.wrapperClassName);

					// reset position to original
					$this.removeData('hcStickyInit').css({
						position: $wrapper.css('position'),
						top: $wrapper.css('top'),
						bottom: $wrapper.css('bottom'),
						left: $wrapper.css('left'),
						right: $wrapper.css('right')
					}).removeClass(options.className);

					// remove events
					$window.off('resize', options.fn.resize).off('scroll', options.fn.scroll);

					// destroy wrapper
					$this.unwrap();
				}
			});

			// on/off settings
			if (options && typeof options.on != 'undefined') {
				if (options.on) {
					this.hcSticky('on');
				} else {
					this.hcSticky('off');
				}
			}

			// stop on commands
			if (typeof options == 'string') return this;

			// do our thing
			return this.each(function(){

				var $this = $(this),
					options = $this.pluginOptions('hcSticky');

				var $wrapper = (function(){ // wrapper exists
						var $this_wrapper = $this.parent('.' + options.wrapperClassName);
						if ($this_wrapper.length > 0) {
							$this_wrapper.css({
								'height': $this.outerHeight(true),
								'width': (function(){
									// check if wrapper already has width in %
									var width = $this_wrapper.style('width');
									if (width.indexOf('%') >= 0 || width == 'auto') {
										if ($this.css('box-sizing') == 'border-box' || $this.css('-moz-box-sizing') == 'border-box') {
											$this.css('width', $this_wrapper.width());
										} else {
											$this.css('width', $this_wrapper.width() - parseInt($this.css('padding-left') - parseInt($this.css('padding-right'))));
										}
										return width;
									} else {
										return $this.outerWidth(true);
									}
								})()
							});
							return $this_wrapper;
						} else {
							return false;
						}
					})() || (function(){ // wrapper doesn't exist

						var this_css = $this.style(['width', 'margin-left', 'left', 'right', 'top', 'bottom', 'float', 'display']);
						var display = $this.css('display');

						var $this_wrapper = $('<div>', {
							'class': options.wrapperClassName
						}).css({
							'display': display,
							'height': $this.outerHeight(true),
							'width': (function(){
								if (this_css['width'].indexOf('%') >= 0 || (this_css['width'] == 'auto' && display != 'inline-block' && display != 'inline')) { // check if element has width in %
									$this.css('width', parseFloat($this.css('width')));
									return this_css['width'];
								} else if (this_css['width'] == 'auto' && (display == 'inline-block' || display == 'inline')) {
									return $this.width();
								} else {
									// check if margin is set to 'auto'
									return (this_css['margin-left'] == 'auto') ? $this.outerWidth() : $this.outerWidth(true);
								}
							})(),
							'margin': (this_css['margin-left']) ? 'auto' : null,
							'position': (function(){
								var position = $this.css('position');
								return position == 'static' ? 'relative' : position;
							})(),
							'float': this_css['float'] || null,
							'left': this_css['left'],
							'right': this_css['right'],
							'top': this_css['top'],
							'bottom': this_css['bottom'],
							'vertical-align': 'top'
						});

						$this.wrap($this_wrapper);

						// ie7 inline-block fix
						if (ie === 7) {
							if ($('head').find('style#hcsticky-iefix').length === 0) {
								$('<style id="hcsticky-iefix">.' + options.wrapperClassName + ' {zoom: 1;}</style>').appendTo('head');
							}
						}

						// return appended element
						return $this.parent();
					})();


				// check if we should go further
				if ($this.data('hcStickyInit')) return;
				// leave our mark
				$this.data('hcStickyInit', true);


				// check if referring element is document
				var stickTo_document = options.stickTo && (options.stickTo == 'document' || (options.stickTo.nodeType && options.stickTo.nodeType == 9) || (typeof options.stickTo == 'object' && options.stickTo instanceof (typeof HTMLDocument != 'undefined' ? HTMLDocument : Document))) ? true : false;

				// select container ;)
				var $container = options.stickTo
					? stickTo_document
						? $document
						: typeof options.stickTo == 'string'
							? $(options.stickTo)
							: options.stickTo
					: $wrapper.parent();

				// clear sticky styles
				$this.css({
					top: 'auto',
					bottom: 'auto',
					left: 'auto',
					right: 'auto'
				});

				// attach event on entire page load, maybe some images inside element has been loading, so chek height again
				$window.load(function(){
					if ($this.outerHeight(true) > $container.height()) {
						$wrapper.css('height', $this.outerHeight(true));
						$this.hcSticky('reinit');
					}
				});

				// functions for attachiung and detaching sticky
				var _setFixed = function(args) {
						// check if already floating
						if ($this.hasClass(options.className)) return;

						// apply styles
						args = args || {};
						$this.css({
							position: 'fixed',
							top: args.top || 0,
							left: args.left || $wrapper.offset().left
						}).addClass(options.className);

						// start event
						options.onStart.apply($this[0]);
						// add class to wrpaeer
						$wrapper.addClass('sticky-active');
					},
					_reset = function(args) {
						args = args || {};
						args.position = args.position || 'absolute';
						args.top = args.top || 0;
						args.left = args.left || 0;

						// check if we should apply css
						if ($this.css('position') != 'fixed' && parseInt($this.css('top')) == args.top) return;

						// apply styles
						$this.css({
							position: args.position,
							top: args.top,
							left: args.left
						}).removeClass(options.className);

						// stop event
						options.onStop.apply($this[0]);
						// remove class from wrpaeer
						$wrapper.removeClass('sticky-active');
					};

				// sticky scroll function
				var onScroll = function(init) {

					// check if we need to run sticky
	        if (!options.on || !$this.is(':visible')) return;

	        // if the element is the same height or larger than the container then let's reset it so that it returns to the original position
	        if ($this.outerHeight(true) >= $container.height()) {
	            _reset();

	            return;
	        }

					var top_spacing = (options.innerSticker) ? $(options.innerSticker).position().top : ((options.innerTop) ? options.innerTop : 0),
						wrapper_inner_top = $wrapper.offset().top,
						bottom_limit = $container.height() - options.bottomEnd + (stickTo_document ? 0 : wrapper_inner_top),
						top_limit = $wrapper.offset().top - options.top + top_spacing,
						this_height = $this.outerHeight(true) + options.bottom,
						window_height = $window.height(),
						offset_top = $window.scrollTop(),
						this_document_top = $this.offset().top,
						this_window_top = this_document_top - offset_top,
						bottom_distance;


					// if sticky has been restarted with on/off wait for it to reach top or bottom
					if (typeof options.remember != 'undefined' && options.remember) {

						var position_top = this_document_top - options.top - top_spacing;

						if (this_height - top_spacing > window_height && options.followScroll) { // element bigger than window with follow scroll on

							if (position_top < offset_top && offset_top + window_height <= position_top + $this.height()) {
								// element is in the middle of the screen, let our primary calculations do the work
								options.remember = false;
							}

						} else { // element smaller than window or follow scroll turned off

							if (options.remember.offsetTop > position_top) {
								// slide up
								if (offset_top <= position_top) {
									_setFixed({
										top: options.top - top_spacing
									});
									options.remember = false;
								}
							} else {
								// slide down
								if (offset_top >= position_top) {
									_setFixed({
										top: options.top - top_spacing
									});
									options.remember = false;
								}
							}

						}

						return;
					}


					if (offset_top > top_limit) {

						// http://geek-and-poke.com/geekandpoke/2012/7/27/simply-explained.html

						if (bottom_limit + options.bottom - (options.followScroll && window_height < this_height ? 0 : options.top) <= offset_top + this_height - top_spacing - ((this_height - top_spacing > window_height - (top_limit - top_spacing) && options.followScroll) ? (((bottom_distance = this_height - window_height - top_spacing) > 0) ? bottom_distance : 0) : 0)) {
							// bottom reached end
							_reset({
								top: bottom_limit - this_height + options.bottom - wrapper_inner_top
							});
						} else if (this_height - top_spacing > window_height && options.followScroll) {

							if (this_window_top + this_height <= window_height) { // element bigger than window with follow scroll on

								if (getScroll.direction == 'down') {
									// scroll down
									_setFixed({
										top: window_height - this_height
									});
								} else {
									// scroll up
									if (this_window_top < 0 && $this.css('position') == 'fixed') {
										_reset({
											top: this_document_top - (top_limit + options.top - top_spacing) - getScroll.distanceY
										});
									}
								}

							} else { // element smaller than window or follow scroll turned off

								if (getScroll.direction == 'up' && this_document_top >= offset_top + options.top - top_spacing) {
									// scroll up
									_setFixed({
										top: options.top - top_spacing
									});
								} else if (getScroll.direction == 'down' && this_document_top + this_height > window_height && $this.css('position') == 'fixed') {
									// scroll down
									_reset({
										top: this_document_top - (top_limit + options.top - top_spacing) - getScroll.distanceY
									});
								}

							}
						} else {
							// starting (top) fixed position
							_setFixed({
								top: options.top - top_spacing
							});
						}
					} else {
						// reset
						_reset();
					}

				};


				// store resize data in case responsive is on
				var resize_timeout = false,
					$resize_clone = false;

				var onResize = function() {

					// check if sticky is attached to scroll event
					attachScroll();

					// check for off resolutions
					checkResolutions();

					// check if we need to run sticky
					if (!options.on) return;

					var setLeft = function(){
						// set new left position
						if ($this.css('position') == 'fixed') {
							$this.css('left', $wrapper.offset().left);
						} else {
							$this.css('left', 0);
						}
					};

					// check for width change (css media queries)
					if (options.responsive) {
						// clone element and make it invisible
						if (!$resize_clone) {
							$resize_clone = $this.clone().attr('style', '').css({
								visibility: 'hidden',
								height: 0,
								overflow: 'hidden',
								paddingTop: 0,
								paddingBottom: 0,
								marginTop: 0,
								marginBottom: 0
							});
							$wrapper.after($resize_clone);
						}

						var wrapper_width = $wrapper.style('width');
						var resize_clone_width = $resize_clone.style('width');

						if (resize_clone_width == 'auto' && wrapper_width != 'auto') {
							resize_clone_width = parseInt($this.css('width'));
						}

						// recalculate wrpaeer width
						if (resize_clone_width != wrapper_width) {
							$wrapper.width(resize_clone_width);
						}

						// clear previous timeout
						if (resize_timeout) {
							clearTimeout(resize_timeout);
						}
						// timedout destroing of cloned elements so we don't clone it again and again while resizing the window
						resize_timeout = setTimeout(function() {
							// clear timeout id
							resize_timeout = false;
							// destroy cloned element
							$resize_clone.remove();
							$resize_clone = false;
						}, 250);
					}

					// set new left position
					setLeft();

					// recalculate inner element width (maybe original width was in %)
					if ($this.outerWidth(true) != $wrapper.width()) {
						var this_w = ($this.css('box-sizing') == 'border-box' || $this.css('-moz-box-sizing') == 'border-box')
							? $wrapper.width()
							: $wrapper.width() - parseInt($this.css('padding-left')) - parseInt($this.css('padding-right'));
						// subtract margins
						this_w = this_w - parseInt($this.css('margin-left')) - parseInt($this.css('margin-right'));
						// set new width
						$this.css('width', this_w);
					}
				};


				// remember scroll and resize callbacks so we can attach and detach them
				$this.pluginOptions('hcSticky', {fn: {
					scroll: onScroll,
					resize: onResize
				}});


				// check for off resolutions
				var checkResolutions = function(){
					if (options.offResolutions) {
						// convert to array
						if (!$.isArray(options.offResolutions)) {
							options.offResolutions = [options.offResolutions];
						}

						var isOn = true;

						$.each(options.offResolutions, function(i, rez){
							if (rez < 0) {
								// below
								if ($window.width() < rez * -1) {
									isOn = false;
									$this.hcSticky('off');
								}
							} else {
								// abowe
								if ($window.width() > rez) {
									isOn = false;
									$this.hcSticky('off');
								}
							}
						});

						// turn on again
						if (isOn && !options.on) {
							$this.hcSticky('on');
						}
					}
				};
				checkResolutions();


				// attach resize function to event
				$window.on('resize', onResize);


				// attaching scroll function to event
				var attachScroll = function(){
					var isAttached = false;
					if ($._data(window, 'events').scroll != undefined) {
						$.each($._data(window, 'events').scroll, function(i, f){
							if (f.handler == options.fn.scroll) {
								isAttached = true;
							}
						});
					}
					if (!isAttached) {
						// run it once to disable glitching
						options.fn.scroll(true);
						// attach function to scroll event only once
						$window.on('scroll', options.fn.scroll);
					}
				};
				attachScroll();

			});
		}
	});

})(jQuery, this);



// jQuery HC-PluginOptions
// =============
// Version: 1.0
// Copyright: Some Web Media
// Author: Some Web Guy
// Author URL: http://twitter.com/some_web_guy
// Website: http://someweblog.com/
// License: Released under the MIT License www.opensource.org/licenses/mit-license.php

(function($, undefined) {
	"use strict";

	$.fn.extend({

		pluginOptions: function(pluginName, defaultOptions, userOptions, commands) {

			// create object to store data
			if (!this.data(pluginName)) this.data(pluginName, {});

			// return options
			if (pluginName && typeof defaultOptions == 'undefined') return this.data(pluginName).options;

			// update
			userOptions = userOptions || (defaultOptions || {});

			if (typeof userOptions == 'object' || userOptions === undefined) {

				// options
				return this.each(function(){
					var $this = $(this);

					if (!$this.data(pluginName).options) {
						// init our options and attach to element
						$this.data(pluginName, {options: $.extend(defaultOptions, userOptions || {})});
						// attach commands if any
						if (commands) {
							$this.data(pluginName).commands = commands;
						}
					} else {
						// update existing options
						$this.data(pluginName, $.extend($this.data(pluginName), {options: $.extend($this.data(pluginName).options, userOptions || {})}));
					}
				});

			} else if (typeof userOptions == 'string') {

				return this.each(function(){
					$(this).data(pluginName).commands[userOptions].call(this);
				});

			} else {

				return this;

			}

		}

	});

})(jQuery);

// Miscellaneous global helpers
window.wb = ( function( window, $, undefined ) {
	'use strict';

	var breakpoints = {
		'phone-wide': 576,
		'wordpress': 601,
		'tablet': 769,
		'tablet-wide': 1024,
		'desk': 1440,
		'desk-wide': 1920
	};

	function getBreakpoint(width) {
		if ( width in breakpoints ) {
			return breakpoints[width];
		}
	}

	return {
		hasAdminBar: function() {
			return $('body').hasClass('admin-bar');
		},
		isIE: function() {
			return (document.all && document.compatMode) || window.navigator.msPointerEnabled;
		},
		largerThan: function(width) {
			var breakpoint = getBreakpoint(width);
			return window.innerWidth >= breakpoint;
		},
		debounce: function(func, wait, immediate) {
			var timeout, args, context, timestamp, result;

			var now = Date.now || function() {
				return new Date().getTime();
			};

			var later = function() {
				var last = now - timestamp;

				if (last < wait && last >= 0) {
					timeout = setTimeout(later, wait - last);
				} else {
					timeout = null;
					if (!immediate) {
						result = func.apply(context, args);
						if (!timeout) { context = args = null; }
					}
				}
			};

			return function() {
				context = this;
				args = arguments;
				timestamp = now;
				var callNow = immediate && !timeout;
				if (!timeout) { timeout = setTimeout(later, wait); }
				if (callNow) {
					result = func.apply(context, args);
					context = args = null;
				}

				return result;
			};
		},
	};
} )( this, jQuery );
( function( window, $ ) {
	'use strict';

	// Get Category slug from URL
	function getSlug( link ) {
		var re = /\/category\/([^\/]+)/gm,
			slugCheck = re.exec(link),
			slug = ( slugCheck ) ? slugCheck[1] : '';
		return slug;
	}

	function parseQueryString(queryString) {
		/* Parse new query string to see if we still have categories present */
		var match,
			urlParams = {},
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = queryString.substring(1);


		while((match = search.exec(query)) !== null) {
			urlParams[decode(match[1])] = decode(match[2]);
		}

		return urlParams;
	}

	function setActiveCategoryClasses(element) {
		var link = $(element),
			href = link.attr('href');

		var slug = getSlug(href);

		if ( '' === slug ) {
			$allLink = $(element);
			$subscribe.attr('href', subscribeURL + '?feed=rss2');
		}

		if (currentCategories.length) {
			if ( '' !== slug && $.inArray(slug, currentCategories) > -1 ) {
				link.addClass('active');
			}
		} else {
			$allLink.addClass('active');
		}
	}

	// Reset filters
	function resetFilters() {
		$allLink.addClass('active');
		$filterContainer.show();
		// Remove appended posts
		$('.filtered-appended').remove();
		// Remove loading
		$(document.getElementById('post-loading')).remove();
		// Reset RSS link
		$subscribe.attr('href', subscribeURL + '?feed=rss2');
	}

	function changeUrl(activeSlugs) {
		var categories = activeSlugs.join(',');
		var uri;
		if (categories.length) {
			uri =  '?filter=true&filter-category=' + categories;
		} else {
			uri = "/" + removeFiltersFromUri(window.location.search);
		}

		// Set browser history
		history.pushState({activeSlugs: activeSlugs}, "", uri);

		// Change pagination URIs
		$('a.page-numbers').each( function(i, link) {
			var uri = decodeURIComponent($(link).attr('href'));
			$(link).attr('href', removeFiltersFromUri(uri) + location.search);
		});

	}

	function removeFiltersFromUri(uri) {
		return uri.replace(/filter=true&filter-category=[a-z0-9,-]*/, '').replace(/\?&/, '?').replace(/\?$/,'');
	}

	if ( $(document.getElementById('active-posts-filter')).length ) {

		var $filter = $(document.getElementById('active-posts-filter')),
			$archiveFilter = $(document.getElementById('posts-filter')),
			$filterLink = $filter.find('li a'),
			$archiveFilterLink = $archiveFilter.find('li a'),
			$filterContainer = $(document.getElementById('filtered-post-container')),
			$subscribe = $(document.getElementById('subscribe-link')),
			subscribeURL = $subscribe.attr('href'),
			pageOneUrl = $($('a.page-numbers')[0]).attr('href').replace(window.location.search,""),
			activeSlugs = [],
			$allLink;

        // Remove all current-menu-item classes because we're using our own class.
        $filter.find( '.current-menu-item').removeClass( 'current-menu-item' );

		var currentCategories = window.location.search.split('filter-category=');

		if ( 2 === currentCategories.length ) {
			currentCategories = decodeURIComponent(currentCategories[1]).replace(/,$/, "").split(',');
			activeSlugs = currentCategories;
		} else {
			currentCategories = false;
		}

		// On page load, set "all" to active
		$filterLink.each(function() {setActiveCategoryClasses(this);});
		$archiveFilterLink.each(function() {setActiveCategoryClasses(this);});

		// On filter click logic
		$filterLink.on('click', function(e) {
			e.preventDefault();

			var link = $(this),
				href = link.attr('href'),
				slug,
				slugindex;

			$('.filtered-appended').hide();
			$filterContainer.hide().before('<div id="post-loading" class="loading"></div>');

			// Get category slug
			if ( '' === getSlug( href ) ) {
				// The "all" filter has been clicked, empty active categories
				activeSlugs = [];
                console.log('removing active classes on filter  links');
				$filterLink.removeClass('active');
				resetFilters();
			} else {
				slug = getSlug( href );
				slugindex = activeSlugs.indexOf(slug);

				// Category was already active, remove it
				if (slugindex > -1) {
					activeSlugs.splice(slugindex, 1);
					link.removeClass('active');
					// There's no more active categories, switch back to all
					if ( ! activeSlugs.length ) {
						resetFilters();
					}
				} else {
					// Category wasn't active, add it
					activeSlugs.push(slug);
                    console.log('removing active link from all link');
					$allLink.removeClass('active');
					link.addClass('active');
				}

				$subscribe.attr('href', subscribeURL + '?cat=' + activeSlugs.join(',') + '&feed=rss2');

				// Filter not active, do that ajax call
				$.ajax({
					url: Windows_Blogs.ajaxurl,
					type: 'POST',
					data: {
						action: Windows_Blogs.action_filter_posts,
						nonce: Windows_Blogs.nonce_filter,
						category_slug: activeSlugs.join(','),
						template: Windows_Blogs.template
					},
					success: function( response ) {

						// There was an error (nonce failed, category doesn't exist, no posts to show...?)
						if ( response.success === false ) {
							window.console.log( response.data.message );
							return;
						}

						// We got posts!
						window.console.log('got posts!');

						var tempDom = $.parseHTML( response );
						// Hide the default posts
						$filterContainer.hide();
						// Remove previous appended posts
						$('.filtered-appended').remove();
						// Remove loading
						$(document.getElementById('post-loading')).remove();
						// Append new posts
						$filterContainer.after( tempDom );

						// New AddThis
						var new_addthis = $('.addthis_toolbox', $(tempDom));

						// Reinit AddThis
						new_addthis.each(function() {
							var addthis = $(this),
								addthis_counter = $(this).find('.addthis_bubble_style');
							window.addthis.toolbox(addthis[0]);
							window.addthis.counter(addthis_counter[0]);
						});

					}
				});

			}

			changeUrl( activeSlugs );

		});

		// On archive filter click logic
		$archiveFilterLink.on('click', function(e) {
			e.preventDefault();

			var link = $(this),
				href = link.attr('href'),
				slug,
				newQueryString,
				urlParams,
				slugindex;

			var redirectUrl = pageOneUrl;

			if ( '' !== getSlug( href ) ) {
				slug = getSlug(href);

				var categorySet = currentCategories && ( $.inArray(slug, currentCategories) > -1 );
				if (categorySet) {
					newQueryString = window.location.search.replace(slug, "").replace(",,",",").replace(/,$/,"");

					urlParams = parseQueryString(newQueryString);

					/* We unset the only set category */
					if (-1 === $.inArray(urlParams['filter-category'], ["",","])) {
						redirectUrl += newQueryString;
					}
				} else {
					urlParams = parseQueryString(window.location.search);
					var categoriesString = urlParams['filter-category'];
					if (!!categoriesString && "" !== categoriesString) {
						var categories = categoriesString.split(",");
						categories.push(slug);
						urlParams["filter-category"] = categories.join(',');
					} else {
						urlParams['filter-category'] = slug;
						urlParams.filter = "true";
					}
					redirectUrl += "?" + $.param(urlParams);

				}



			}

			window.location.href = redirectUrl;

		});

	}

} )( this, jQuery );
( function( window, $, undefined ) {
	'use strict';

	// Make some columns the same height to have a consistent vertical rule
	// Add class iso-height to the direct parent
	// Add data attribute extra-height to add extra padding at the bottom
	// Use class iso-height-skip to apply a min height to a column but not take its height into account
	// Use class iso-height-ignore to ignore a column and not apply any height to it
	function EqualColumns(element, options) {
		var defaults = {
			extraHeight: 0,
			columnClass: '.column',
			ignoreClass: '.iso-height-ignore',
			skipClass: '.iso-height-skip',
			onInit: function() {}
		};

		this.options = $.extend({}, defaults, options);

		this.element = element;
		this.$container_elem = $(element);
		this.$cols = $(this.options.columnClass, this.$container_elem).not(this.options.ignoreClass);
		this.heights = [];

		this.init();
	}

	EqualColumns.prototype = {
		init: function() {
			var self = this;

			// Custom init function
			self.options.onInit.call(self);

			$(window).on('load', function() {
				self.applyOrReset();
			});

			$(window).on('resize', function() {
				wb.debounce( self.applyOrReset(), 300);
			});

		},
		applyOrReset: function() {
			var self = this;
			if ( wb.largerThan('tablet-wide') ) {
				self.applyHeights();
			} else {
				self.resetHeights();
			}
		},
		resetHeights: function() {
			var self = this;
			self.heights = [];
			self.$cols.css('min-height', '0');
		},
		applyHeights: function() {
			var self = this;

			// Reset heights before applying
			self.resetHeights();

			self.$cols.each(function() {
				// Do not save skipped columns heights
				if ( $(this).is(self.options.skipClass) ) {
					return true;
				}
				var colHeight = $(this).outerHeight();
				self.heights.push(colHeight);
			});

			// Find the tallest column
			var max = Math.max.apply(Math, self.heights);

			// Apply height to all columns
			self.$cols.css('min-height', max + self.options.extraHeight);
		}
	};

	$.extend($.fn, {
		equalcolumns: function (options) {
			return this.each(function () {
				if (!$.data(this, 'wb_' + 'equalcolumns')) {
					$.data(this, 'wb_' + 'equalcolumns',
							new EqualColumns(this, options));
				}
			});
		}
	});
} )( this, jQuery );
( function( window, $, undefined ) {
	'use strict';

	var $mainNav = $( document.getElementById( 'main-nav' ) ),
		$bottomBar = $( document.getElementById( 'bottom-bar' ) );

	// Make videos nice on all screen sizes
	$('.post-content').fitVids();

	// Make sidebar and main content the same height on archive and single pages
	$('.iso-height').equalcolumns();


	// Stick related articles
	if ( $('.related-articles').length ) {
		var stickOffset = ( wb.hasAdminBar() ) ? $('.main-nav').height() + 62 : $('.main-nav').height() + 30;
		$('.related-articles').hcSticky({
			top: stickOffset,
			offResolutions: [-1024]
		});
	}

	// Stick bottom bar menu
	function stickOrUnstick() {
		var stickOffset = ( wb.hasAdminBar() ) ? 32 : 0;
		if ( ! wb.largerThan('tablet-wide') ) {
			if ( $mainNav.data('hcStickyInit') ) {
				$mainNav.hcSticky('destroy');
			}
			$mainNav.attr('style', '');
		} else {
			if ( ! $mainNav.data('hcStickyInit') ) {
				$mainNav.hcSticky({ stickTo: document, top: stickOffset });
			}
		}
	}
	stickOrUnstick();
	$(window).on('resize', function() {
		wb.debounce( stickOrUnstick(), 300);
	});

	// Variables
	var mobileMenuButton = $(document.getElementById('toggle-mobile-menu')),
		mainHeaderEl	 = $(document.getElementById('main-header'));

	// Load accessibility attributes
	$(document).ready( function() {
		mobileMenuButton.attr('aria-expanded', 'false');
	});

	// Toggle mobile menu
	mobileMenuButton.on('click', function(e) {
		e.preventDefault();
		mainHeaderEl.toggleClass('toggled');
		if ( mainHeaderEl.hasClass('toggled') ) {
			mobileMenuButton.attr('aria-expanded', 'true');
		} else {
			mobileMenuButton.attr('aria-expanded', 'false');
		}
	});

	// Toggle mobile submenu
	$('.menu-item-has-children').on('click', '> a', function(e) {
		e.preventDefault();
		$(this).parent('li').toggleClass('active');
		$(this).next('.sub-menu').slideToggle();
	}).on('focus', 'a', function(e) {
		$(this).parentsUntil('menu-item-has-children').addClass('focused');
	}).on('blur', 'a', function(e) {
		$(this).parentsUntil('menu-item-has-children').removeClass('focused');
	});


	// Create slideshow thumbnails.
	$( '.jetpack-slideshow' ).each( function () {
		var $container = $( this );

		// Add the download link.
		var interval = setInterval( function() {
			// Check if Jetpack has already processed gallery
			if ( true === $container.data( 'processed' ) ) {
				clearInterval( interval );
				// Attachment data is the next sibling with class jetpack-slideshow-attachments
				var attachment_data = $container.nextAll( '.jetpack-slideshow-attachments:first' ).data( 'gallery' );
				console.log(attachment_data);
				$( '.slideshow-slide', $container ).each( function( i, el ) {
					var $div = $(
						'<div>',
						{
							'class' : 'slideshow-slide-link'
						}
					);
					var src = $( this ).find( 'img' ).attr( 'src' );
					// We have files that could have been risezed like 'http://az648995.vo.msecnd.net/win/2015/11/Halo-1024x551.jpg';
					// this regexp matches the last -1024x551, then captures the last filetype and creates the basic file. http://az648995.vo.msecnd.net/win/2015/11/Halo.jpg
					src = src.replace(
						/-\d+x\d+(\.\S+)$/,
						function( match, contents, offset, s ) {
							return contents;
						}
					);
					console.log(src);
					var $link = $(
						'<a>',
						{
							text: 'Download in Hi Res',
							'href' : attachment_data[src].url,
							'class' : 'download-link'
						}
					);
					$div.append( $link );
					$( this ).prepend( $div );
				} );
			}
		}, 300 );


		var $thumb_container = $(
			'<div>',
			{
				'class' : 'slideshow-slide-thumb-container',
			}
		);

		var thumb_slideshow_controls =
			'<div class="slideshow-controls">' +
				'<a class="prev" href="#"></a>' +
				'<a href="#" class="paused"></a>' +
				'<a href="#" class="next"></a>' +
			'</div>';

		var images = $container.data( 'gallery' );
		// create the thumbnails.
		$.each( $container.data( 'gallery' ), function( index, element ) {

			var $div = $(
				'<div>',
				{
					'class' : 'slideshow-slide-thumb',
				}
			);

			// Show only three thumbs.
			if ( index >= 3 ) {
				$div.css( 'display', 'none' );
			}
			$div.css( 'background-image', 'url(' + this.src + ')' );

			$thumb_container.append( $div );
		} );

		$thumb_container.append( thumb_slideshow_controls );

		$container.after( $thumb_container );

		// Hide next/prev accordingly.
		$( '.slideshow-controls a.prev' ).css( 'visibility', 'hidden' );
		if (  images.length <= 3 ) {
			$( '.slideshow-controls a.next' ).css( 'visibility', 'hidden' );
		}
		var first_visible = 1;
		var last_visible = 3;
		// handle next/prev clicks
		$thumb_container.on( 'click', '.slideshow-controls a', function( e ) {
			var $clicked_el = $( this );
			if ( $clicked_el.hasClass( 'next' ) && last_visible < images.length ) {
				$( '.slideshow-slide-thumb:nth-child( ' + first_visible + ')', $thumb_container ).hide();
				first_visible += 1;
				last_visible += 1;
				$( '.slideshow-slide-thumb:nth-child( ' + last_visible + ')', $thumb_container ).show();
				// Hide next if needed, display prev.
				$clicked_el.siblings( '.prev' ).css( 'visibility', 'visible' );
				if ( last_visible === images.length ) {
					$clicked_el.css( 'visibility', 'hidden' );
				}
			} else if ( $clicked_el.hasClass( 'prev' ) && first_visible > 1 ) {
				first_visible -= 1;
				$( '.slideshow-slide-thumb:nth-child( ' + first_visible + ')', $thumb_container ).show();
				$( '.slideshow-slide-thumb:nth-child( ' + last_visible + ')', $thumb_container ).hide();
				last_visible -= 1;
				$clicked_el.siblings( '.next' ).css( 'visibility', 'visible' );
				if ( first_visible === 1 ) {
					$clicked_el.css( 'visibility', 'hidden' );
				}
			}
			e.preventDefault();
			e.stopImmediatePropagation();
		} );

		// When a thumb is clicked, show it in main slideshow
		$thumb_container.on( 'click', '.slideshow-slide-thumb', function( e ) {
			$container.cycle( $( this ).index() );
		} );

	} );

	// Skype share button
	function shareUsingSkypeRawLink() {

		var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});

		window.open('https://web.skype.com/share?url=' + $(location).attr('href') + '&lang=en-US&flow_id=' + guid, '_blank', 'toolbar=no, scrollbars=yes, resizable=yes, width=305, height=665');
		return false;
	}

	$('.addthis_button_skype').on('click', function(e) {
		e.preventDefault();

		// Loan Skype window
		shareUsingSkypeRawLink();
	});

	// Search Toggle
	function searchToggle() {
		var searchForm = $mainNav.find( '.search-form' );

		searchForm.on( 'click', '.icon-search', function () {
			searchForm.toggleClass( 'is-active' );
		} );
	}
	searchToggle();

	// Clone the site navigation (if it exists) and insert it under the current menu item.
	var currentMenuItem = $mainNav.find( '.network-menu .ms-current-blog' ),
		siteNavigation = $bottomBar.find( '.site-menu-container' ).clone(),
		stickyWrapper = $bottomBar.find( '.wrapper-sticky' );

	if ( 0 < currentMenuItem.length && 1 === siteNavigation.length ) {
		currentMenuItem = $( currentMenuItem[0] );
		siteNavigation.addClass( 'site-menu-clone' );
		currentMenuItem.append( siteNavigation );
	}
	
	if ( 0 === siteNavigation.length ) {
		stickyWrapper.addClass( 'no-site-nav' );
	}

} )( this, jQuery );

( function( window, $, undefined ) {
    document.addEventListener('DOMContentLoaded', function() {
        /**
         * Section handles the on page load part of the ageGate Process.
         */
        var ageGateVideos = findAgeGateVideos();
        var ageGateSubmitBtns = findAgeGateSubmitButtons();
        processAgeGateVideos(ageGateVideos);

        /**
         * If we have a placeholder, display it initially.
         */
        $('body').on('click', '.age-gate .play-button', function () {
            var self = $( this );

            self.parents( '.age-gate' ).addClass( 'show-form' );
        });

        /**
         * Section handles the form submission process.
         */
        nodeListMap(ageGateSubmitBtns, function(button) {
            button.addEventListener('click', function(event) {
              var age = determineUsersAge(event);
              var isOldEnough = userIsOldEnough(age);
              setAgeGateCookie(isOldEnough);
              canViewVideo(isOldEnough, ageGateVideos);
            });
        });
    });

    /**
     * Function does the initial check on page load, to see if a user has already
     * been approved or dinied the ability to watch age gate videos.
     * @param  {NodeList} ageGateVideos An array of all age gate DOM Nodes.
     */
    function processAgeGateVideos(ageGateVideos) {
        var savedUserData;
        if ( hasAgeGateVideos(ageGateVideos) ) {
            try {
                savedUserData = getAgeGateCookie();
                canViewVideo(savedUserData, ageGateVideos);
            } catch(e) {
                console.warn(e);
            }
        }
    }

    /**
     * Function will take to the user submitted form data, and determine that user's age.
     * @param  {Event Object} event A DOM Click event Object
     * @return {int}       The User's age in years.
     */
    function determineUsersAge(event) {
        event.preventDefault();
        var form = $(event.target).closest('form');
        var options = form[0].querySelectorAll('select');
        var formData = getFormData(options);
        return calculateUsersAge(new Date(formData.year, formData.month, formData.day));
    }

    /**
     * This function will check the DOM for any and all age gate video DOM Elements.
     * @return {array} An array of all age gate DOM elements found, or an empty array.
     */
    function findAgeGateVideos() {
        return document.querySelectorAll('.age-gate-wrap');
    }

    /**
     * This function will check the DOM for any and all age gate Form Buttons.
     * @return {array} An array of all age gate Form Buttons found, or an empty array.
     */
    function findAgeGateSubmitButtons() {
        return document.querySelectorAll('.js-form-submit');
    }

    /**
     * Function checks to see if we have any ageGate Videos on the page. This is
     * a boolean true/false check.
     * @param  {array}  ageGateVideos An array of all age gate DOM elements
     * @return {Boolean}
     */
    function hasAgeGateVideos(ageGateVideos) {
        return (ageGateVideos && 0 < ageGateVideos.length) ? true : false;
    }

    /**
     * This function will check to see if we have an ageGate cookie saved, if so,
     * it will return a boolean value. If not, this function will return null.
     * @return {bool | null}
     */
    function getAgeGateCookie() {
      var val = sessionStorage.getItem('video-age-gate');
      if ('true' === val || 'false' === val) {
        return (val === 'true');
      } else {
        return val;
      }
    }

    /**
     * Function will save an ageGate cookie for a given user.
     * @param {bool} userInfo A boolean value representing whether or not a user is of age.
     */
    function setAgeGateCookie(userInfo) {
        sessionStorage.setItem('video-age-gate', userInfo);
    }

    /**
     * Function is responsible for updating the DOM depending on a given input value.
     * This function will place the DOM state into one of three state:
     * 1. Hide Form.
     * 2. Show Form.
     * 3. Show Restricted Message
     * @param  {bool} savedUserData Can a user watch the video
     * @param  {array} ageGateVideos An array of age gate video DOM elements.
     */
    function canViewVideo(savedUserData, ageGateVideos) {
        if (null === savedUserData) {
          return;

        } else if (true === savedUserData) {
            nodeListMap(ageGateVideos, hideAgeGateOverlay);

        } else if (false === savedUserData) {
            var videoElements = document.querySelectorAll('embed-youtube');
            nodeListMap(ageGateVideos, showRestrictedMessage);
            nodeListMap(videoElements, removeVideoIframes);
        }
    }

    /**
     * Function manipulates the DOM to hide the form.
     * @param  {DOM Node} overlay The DOM element of the form to hide.
     */
    function hideAgeGateOverlay(overlay) {
        overlay.parentNode.classList.add( 'age-verified' );
    }

    /**
     * Function manipulates the DOM and removes the youtube video iframe.
     * @param  {DOM Node} video The DOM element representing the video player wrapper.
     */
    function removeVideoIframes(video) {
        var videoElement = video.querySelector('iframe');
        video.removeChild(videoElement);
    }

    /**
     * Function manipulates the DOM to replace the Form with a Restricted Message.
     * @param  {DOM Node} overlay The DOM element of the form you want to restrict.
     */
    function showRestrictedMessage(overlay) {
        overlay.innerHTML = '';
        var heading = document.createElement('h2');
        var headingContent = document.createTextNode(Windows_Blogs.restriction_message);
        heading.appendChild(headingContent);
        overlay.appendChild(heading);
    }

    /**
     * A helper function to allow you an easy way to loop over a NodeList, which is an
     * array like Object, but that does not have a native map function.
     * @param  {NodeList}   data     The list/array of DOM nodes.
     * @param  {Function} callback The function you wish to apply to each DOM Node in the NodeList.
     */
    function nodeListMap(data, callback) {
        if (data) {
            return [].map.call( data, callback );
        }
    }

    /**
     * This function gets all the data from a given form and returns that data.
     * @param  {DOM Node} form The DOM node of the form who's data you are trying to get.
     * @return {Object}      Returns an object with key/value pairs of all the form data.
     */
    function getFormData(form) {
        var data = {};
        nodeListMap(form, function(select) {
            data[select.name] = parseInt(select.value);
            test = 0;
        });
        return data;
    }

    /**
     * Function takes the user submited birthday, and determines the user's age.
     * @param  {Date Object} birthday The User Submitted birthday.
     * @return {int}          The user's age in years.
     */
    function calculateUsersAge(birthday) {
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    /**
     * Function does a boolean check to see if the user is old enough.
     * @param  {int} age The user's age.
     * @return {bool}     A boolean value representing whether or not the user is old enough.
     */
    function userIsOldEnough(age) {
      return (16 < age) ? true: false;
    }
} )( this, jQuery );
