/**
 * External dependencies
 */
import { intersection } from 'lodash';

/**
 * Internal dependencies
 */
import createSelector from 'wp-calypso-client/lib/create-selector';
import { getSiteProducts } from 'wp-calypso-client/state/sites/selectors';

/**
 * Type dependencies
 */
import type { AppState } from 'wp-calypso-client/types';

export default createSelector(
	( state: AppState, siteId: number | null, productSlug: string | string[] ): boolean | null => {
		const siteProducts = getSiteProducts( state, siteId );
		if ( null === siteProducts ) {
			return null;
		}
		if ( ! Array.isArray( productSlug ) ) {
			productSlug = [ productSlug ];
		}
		return (
			intersection(
				siteProducts.map( ( { productSlug: slug } ) => slug ),
				productSlug
			).length > 0
		);
	},
	( state: AppState, siteId: number | null ) => getSiteProducts( state, siteId ),
	( state: AppState, siteId: number | null, productSlug: string | string[] ): string => {
		siteId = siteId || 0;
		if ( ! Array.isArray( productSlug ) ) {
			productSlug = [ productSlug ];
		}
		return `{ siteId || 0 }-${ productSlug.join( '-' ) }`;
	}
);
