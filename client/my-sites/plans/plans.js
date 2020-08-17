/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * Internal Dependencies
 */
import { getSelectedSiteId } from 'wp-calypso-client/state/ui/selectors';
import getIntervalTypeForTerm from 'wp-calypso-client/lib/plans/get-interval-type-for-term';
import getCurrentPlanTerm from 'wp-calypso-client/state/selectors/get-current-plan-term';
import Plans from 'wp-calypso-client/my-sites/plans/main';

export default connect( ( state, { intervalType } ) => {
	// For WP.com plans page, if intervalType is not explicitly specified in the URL,
	// we want to show plans of the same term as plan that is currently active
	if ( ! intervalType ) {
		const selectedSiteId = getSelectedSiteId( state );
		intervalType = getIntervalTypeForTerm( getCurrentPlanTerm( state, selectedSiteId ) );
	}

	return {
		intervalType,
	};
} )( Plans );
