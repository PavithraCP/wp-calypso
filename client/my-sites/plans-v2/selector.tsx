/**
 * External dependencies
 */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import page from 'page';

/**
 * Internal dependencies
 */
import PlansFilterBar from './plans-filter-bar';
import PlansColumn from './plans-column';
import ProductsColumn from './products-column';
import { SECURITY } from './constants';
import { durationToString } from './utils';
import { TERM_ANNUALLY } from 'wp-calypso-client/lib/plans/constants';
import { getSelectedSiteId, getSelectedSiteSlug } from 'wp-calypso-client/state/ui/selectors';
import Main from 'wp-calypso-client/components/main';
import QueryProductsList from 'wp-calypso-client/components/data/query-products-list';
import QuerySites from 'wp-calypso-client/components/data/query-sites';

/**
 * Type dependencies
 */
import type {
	Duration,
	ProductType,
	SelectorPageProps,
	SelectorProduct,
	PurchaseCallback,
} from './types';

import './style.scss';

const SelectorPage = ( { defaultDuration = TERM_ANNUALLY, rootUrl }: SelectorPageProps ) => {
	const siteId = useSelector( ( state ) => getSelectedSiteId( state ) );
	const siteSlug = useSelector( ( state ) => getSelectedSiteSlug( state ) ) || '';
	const [ productType, setProductType ] = useState< ProductType >( SECURITY );
	const [ currentDuration, setDuration ] = useState< Duration >( defaultDuration );

	// Sends a user to a page based on whether there are subtypes.
	const selectProduct: PurchaseCallback = ( product: SelectorProduct ) => {
		const durationString = durationToString( currentDuration );
		const root = rootUrl.replace( ':site', siteSlug );
		if ( product.subtypes.length ) {
			page( `${ root }/${ product.productSlug }/${ durationString }/details` );
		} else {
			page( `${ root }/${ product.productSlug }/${ durationString }/additions` );
		}
	};

	return (
		<Main className="selector__main" wideLayout>
			<PlansFilterBar
				onProductTypeChange={ setProductType }
				productType={ productType }
				onDurationChange={ setDuration }
				duration={ currentDuration }
			/>
			<div className="plans-v2__columns">
				<PlansColumn
					duration={ currentDuration }
					onPlanClick={ selectProduct }
					productType={ productType }
					siteId={ siteId }
				/>
				<ProductsColumn
					duration={ currentDuration }
					onProductClick={ selectProduct }
					productType={ productType }
					siteId={ siteId }
				/>
			</div>
			<QueryProductsList />
			{ siteId && <QuerySites siteId={ siteId } /> }
		</Main>
	);
};

export default SelectorPage;
