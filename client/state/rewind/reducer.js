/**
 * Internal dependencies
 */
import { combineReducers, keyedReducer } from 'wp-calypso-client/state/utils';
import backups from './backups/reducer';
import capabilities from './capabilities/reducer';
import state from './state/reducer';

const rewind = combineReducers( {
	backups,
	capabilities,
	state,
} );

export default keyedReducer( 'siteId', rewind );
