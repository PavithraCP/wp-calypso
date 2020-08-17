/**
 * Internal dependencies
 */
import wpcom from 'wp-calypso-client/lib/wp';
import {
	POST_REQUEST_FAILURE,
	POST_REQUEST_SUCCESS,
	POST_REQUEST,
} from 'wp-calypso-client/state/action-types';
import { receivePost } from 'wp-calypso-client/state/posts/actions/receive-post';

import 'wp-calypso-client/state/posts/init';

/**
 * Triggers a network request to fetch a specific post from a site.
 *
 * @param  {number}   siteId Site ID
 * @param  {number}   postId Post ID
 * @returns {Function}        Action thunk
 */
export function requestSitePost( siteId, postId ) {
	return ( dispatch ) => {
		dispatch( {
			type: POST_REQUEST,
			siteId,
			postId,
		} );

		return wpcom
			.site( siteId )
			.post( postId )
			.get()
			.then( ( post ) => {
				dispatch( receivePost( post ) );
				dispatch( {
					type: POST_REQUEST_SUCCESS,
					siteId,
					postId,
				} );
			} )
			.catch( ( error ) => {
				dispatch( {
					type: POST_REQUEST_FAILURE,
					siteId,
					postId,
					error,
				} );
			} );
	};
}
