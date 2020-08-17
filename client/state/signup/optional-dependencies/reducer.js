/**
 * Internal dependencies
 */
import { SIGNUP_OPTIONAL_DEPENDENCY_SUGGESTED_USERNAME_SET } from 'wp-calypso-client/state/action-types';
import { combineReducers, withSchemaValidation } from 'wp-calypso-client/state/utils';
import { suggestedUsernameSchema } from './schema';

const suggestedUsername = withSchemaValidation( suggestedUsernameSchema, ( state = '', action ) => {
	switch ( action.type ) {
		case SIGNUP_OPTIONAL_DEPENDENCY_SUGGESTED_USERNAME_SET: {
			return action.data;
		}
	}

	return state;
} );

export default combineReducers( {
	suggestedUsername,
} );
