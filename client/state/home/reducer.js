/**
 * Internal dependencies
 */
import {
	HOME_LAYOUT_SET,
	HOME_QUICK_LINKS_EXPAND,
	HOME_QUICK_LINKS_COLLAPSE,
} from 'wp-calypso-client/state/action-types';
import { combineReducers, keyedReducer, withSchemaValidation } from 'wp-calypso-client/state/utils';

export const layout = ( state = {}, action ) =>
	action.type === HOME_LAYOUT_SET ? action.layout : state;

export const sites = keyedReducer(
	'siteId',
	combineReducers( {
		layout,
	} )
);

const schema = {
	type: 'string',
};

export const quickLinksToggleStatus = withSchemaValidation(
	schema,
	( state = 'expanded', action ) => {
		switch ( action.type ) {
			case HOME_QUICK_LINKS_EXPAND:
				return 'expanded';
			case HOME_QUICK_LINKS_COLLAPSE:
				return 'collapsed';
			default:
				return state;
		}
	}
);

export default combineReducers( {
	quickLinksToggleStatus,
	sites,
} );
