/**
 * Internal dependencies
 */
import { withoutPersistence } from 'wp-calypso-client/state/utils';
import {
	CONCIERGE_INITIAL_REQUEST,
	CONCIERGE_INITIAL_UPDATE,
} from 'wp-calypso-client/state/action-types';

export const scheduleId = withoutPersistence( ( state = null, action ) => {
	switch ( action.type ) {
		case CONCIERGE_INITIAL_REQUEST:
			return null;
		case CONCIERGE_INITIAL_UPDATE: {
			const { initial } = action;
			return initial.scheduleId;
		}
	}

	return state;
} );

export default scheduleId;
