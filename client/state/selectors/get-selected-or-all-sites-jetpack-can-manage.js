/**
 * Internal dependencies
 */

import createSelector from 'wp-calypso-client/lib/create-selector';
import canCurrentUser from 'wp-calypso-client/state/selectors/can-current-user';
import getSelectedOrAllSites from 'wp-calypso-client/state/selectors/get-selected-or-all-sites';
import { isJetpackSite } from 'wp-calypso-client/state/sites/selectors';

/**
 * Return an array with the selected site or all sites Jetpack can manage
 *
 * @param {object} state  Global state tree
 * @returns {Array}        Array of Sites objects with the result
 */
export default createSelector(
	( state ) =>
		getSelectedOrAllSites( state ).filter(
			( site ) =>
				isJetpackSite( state, site.ID ) && canCurrentUser( state, site.ID, 'manage_options' )
		),
	( state ) => [ state.ui.selectedSiteId, state.sites.items, state.currentUser.capabilities ]
);
