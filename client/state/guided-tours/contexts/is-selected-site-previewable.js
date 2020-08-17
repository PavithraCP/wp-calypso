/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { getSelectedSite } from 'wp-calypso-client/state/ui/selectors';

/**
 * Returns true if the selected site can be previewed
 *
 * @param {object} state Global state tree
 * @returns {boolean} True if selected site can be previewed, false otherwise.
 */
export const isSelectedSitePreviewable = ( state ) =>
	get( getSelectedSite( state ), 'is_previewable', false );
