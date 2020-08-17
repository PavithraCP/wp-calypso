/**
 * Internal dependencies
 */
import { WORDADS_STATUS_RECEIVE } from 'wp-calypso-client/state/action-types';
import { keyedReducer, withSchemaValidation } from 'wp-calypso-client/state/utils';
import { wordadsStatusSchema } from './schema';

export const items = withSchemaValidation(
	wordadsStatusSchema,
	keyedReducer( 'siteId', ( state, action ) => {
		switch ( action.type ) {
			case WORDADS_STATUS_RECEIVE:
				return action.status;
			default:
				return state;
		}
	} )
);

export default items;
