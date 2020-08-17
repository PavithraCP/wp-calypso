/**
 * Internal dependencies
 */
import createSelector from 'wp-calypso-client/lib/create-selector';
import { getPostEdits } from 'wp-calypso-client/state/posts/selectors/get-post-edits';
import { getSitePost } from 'wp-calypso-client/state/posts/selectors/get-site-post';
import { applyPostEdits } from 'wp-calypso-client/state/posts/utils';

import 'wp-calypso-client/state/posts/init';

/**
 * Returns a post object by site ID post ID pairing, with editor revisions.
 *
 * @param   {object} state  Global state tree
 * @param   {number} siteId Site ID
 * @param   {number} postId Post ID
 * @returns {object}        Post object with revisions
 */
export const getEditedPost = createSelector(
	( state, siteId, postId ) => {
		const post = getSitePost( state, siteId, postId );
		const edits = getPostEdits( state, siteId, postId );
		if ( ! edits ) {
			return post;
		}

		return applyPostEdits( post, edits );
	},
	( state ) => [ state.posts.queries, state.posts.edits ]
);
