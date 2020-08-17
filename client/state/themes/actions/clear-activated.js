/**
 * Internal dependencies
 */
import { THEME_CLEAR_ACTIVATED } from 'wp-calypso-client/state/themes/action-types';

import 'wp-calypso-client/state/themes/init';

/**
 * Returns an action object to be used in signalling that theme activated status
 * for site should be cleared
 *
 * @param  {number}   siteId    Site ID
 * @returns {object}        Action object
 */
export function clearActivated( siteId ) {
	return {
		type: THEME_CLEAR_ACTIVATED,
		siteId,
	};
}
