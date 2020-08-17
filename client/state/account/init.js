/**
 * Internal dependencies
 */
import { registerReducer } from 'wp-calypso-client/state/redux-store';
import accountReducer from './reducer';

registerReducer( [ 'account' ], accountReducer );
