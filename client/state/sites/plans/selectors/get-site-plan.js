/**
 * Internal dependencies
 */
import createSelector from 'wp-calypso-client/lib/create-selector';
import { getPlansBySiteId } from 'wp-calypso-client/state/sites/plans/selectors/get-plans-by-site';

/**
 * Returns a site specific plan
 *
 * @param  {object} state        global state
 * @param  {number} siteId       the site id
 * @param  {string} productSlug  the plan product slug
 * @returns {object} the matching plan
 */
export const getSitePlan = createSelector(
	( state, siteId, productSlug ) => {
		const plansBySiteId = getPlansBySiteId( state, siteId );
		if ( ! plansBySiteId || ! plansBySiteId.data ) {
			return null;
		}
		return plansBySiteId.data.filter( ( plan ) => plan.productSlug === productSlug ).shift();
	},
	( state, siteId ) => getPlansBySiteId( state, siteId )
);
