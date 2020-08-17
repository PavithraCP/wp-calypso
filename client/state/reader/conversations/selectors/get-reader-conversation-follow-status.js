/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { key } from 'wp-calypso-client/state/reader/conversations/utils';

import 'wp-calypso-client/state/reader/init';

/*
 * Get the conversation following status for a given post
 *
 * @param  {object}  state  Global state tree
 * @param  {object} params Params including siteId and postId
 * @returns {string|null} Conversation follow status (F for following, M for muting, or null)
 */
export default function getReaderConversationFollowStatus( state, { siteId, postId } ) {
	return get( state, [ 'reader', 'conversations', 'items', key( siteId, postId ) ], null );
}
