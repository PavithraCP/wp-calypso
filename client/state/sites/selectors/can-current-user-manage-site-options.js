/**
 * Internal dependencies
 */
import { getSelectedSiteId } from 'wp-calypso-client/state/ui/selectors';
import canCurrentUser from 'wp-calypso-client/state/selectors/can-current-user';

/**
 * Whether the user can manage site options.
 *
 * @param {object} state Global state tree
 * @param {number} siteId ID of the site
 * @returns {boolean} Whether the use can manage site options
 */
export default function canCurrentUserManageSiteOptions( state, siteId = null ) {
	if ( ! siteId ) {
		siteId = getSelectedSiteId( state );
	}
	return canCurrentUser( state, siteId, 'manage_options' );
}
