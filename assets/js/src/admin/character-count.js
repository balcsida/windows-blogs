/**
 * Adds a character count interface to the edit form for ms-context terms.
 *
 * @package Microsoft\Windows\Blogs
 * @author  10up
 */

( function ( Countable, msCharacterCount ) {
	'use strict';

	var counters = {
		counters: {},
		current: {}
	},

	/**
	 * Initialize a new counter.
	 *
	 * @param object el      The element which should be counted.
	 * @param int    limit   The character limit that should be recommended.
	 * @param string comment The comment to put next to the counter.
	 */
	initCounter = function ( el, limit, comment ) {
		var headline = document.createElement( 'p' ),
			counter = document.createElement( 'span' ),
			current = document.createElement( 'span' );

			// Bail early if we don't have the element.
			if ( ! el || 1 > el.length ) {
				return;
			}

			// Build out the counter and headline.
			current.className = 'current';

			counter.innerHTML = current.outerHTML + ' / ' + limit;
			counter.className = 'ms-counter';

			headline.className = 'description has-counter';
			headline.innerHTML = comment + counter.outerHTML;
			headline.id        = el.id + '-ms-counter';

			el.insertAdjacentHTML( 'beforebegin', headline.outerHTML );
			el.dataset.msCounter = headline.id;
			el.dataset.msLimit   = limit;

			// Store our counter in counters.
			counters.counters[ headline.id ] = document.querySelector( '#' + headline.id + ' .ms-counter' );
			counters.current[ headline.id ] = document.querySelector( '#' + headline.id + ' .current' );

			// Finally, initialize the counter.
			Countable.live( el, updateCounter );
	},

	/**
	 * Callback that's run when a Countable field is updated.
	 *
	 * @param object count A JavaScript object with the current count values.
	 */
	updateCounter = function ( count ) {
		var current = counters.current[ this.dataset.msCounter ] || {},
			counter = counters.counters[ this.dataset.msCounter ] || {},
			limit = this.dataset.msLimit;

		current.innerHTML = count.characters;

		// Toggle the .over-limit class.
		if ( count.characters > limit ) {
			counter.classList.add( 'over-limit' );

		} else if ( counter.classList.contains( 'over-limit' ) ) {
			counter.classList.remove( 'over-limit' );
		}
	};

	// Initialize counters.
	initCounter( document.getElementById( 'tag-name' ), 24, msCharacterCount.nameLimitText );
	initCounter( document.querySelector( '#edittag #name' ), 24, msCharacterCount.nameLimitText );
	initCounter( document.getElementsByName( 'description' )[0], 174, msCharacterCount.descriptionLimitText );

} ( Countable, msCharacterCount, undefined ) );
