/**
 * Internal Dependencies
 */
import {
	READER_UNSEEN_STATUS_REQUEST,
	READER_UNSEEN_STATUS_RECEIVE,
} from 'wp-calypso-client/state/action-types';

/**
 * Load data layer dependencies
 */
import 'wp-calypso-client/state/data-layer/wpcom/seen-posts/unseen/status';

import 'wp-calypso-client/state/reader-ui/init';

/**
 * Request unseen status for any section
 *
 * @returns {{type: string}} redux action
 */
export const requestUnseenStatus = () => ( {
	type: READER_UNSEEN_STATUS_REQUEST,
} );

/**
 * Receive unseen status for any section
 *
 * @param status whether or not we have unseen content in any section
 * @returns {{type: string, status: *}} redux action
 */
export const receiveUnseenStatus = ( { status } ) => ( {
	type: READER_UNSEEN_STATUS_RECEIVE,
	status,
} );
