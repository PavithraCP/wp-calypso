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
import { durationToString, getProductUpsell, checkout } from './utils';
import { TERM_ANNUALLY } from 'lib/plans/constants';
import { getSiteProducts } from 'state/sites/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'state/ui/selectors';
import { managePurchase } from 'me/purchases/paths';
import Main from 'components/main';
import QueryProductsList from 'components/data/query-products-list';
import QuerySitePurchases from 'components/data/query-site-purchases';
import QuerySites from 'components/data/query-sites';
import JetpackFreeCard from 'components/jetpack/card/jetpack-free-card';

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

const SelectorPage = ( {
	defaultDuration = TERM_ANNUALLY,
	rootUrl,
	header,
	footer,
}: SelectorPageProps ) => {
	const siteId = useSelector( ( state ) => getSelectedSiteId( state ) );
	const siteSlug = useSelector( ( state ) => getSelectedSiteSlug( state ) ) || '';
	const siteProducts = useSelector( ( state ) => getSiteProducts( state, siteId ) );
	const [ productType, setProductType ] = useState< ProductType >( SECURITY );
	const [ currentDuration, setDuration ] = useState< Duration >( defaultDuration );

	// Sends a user to a page based on whether there are subtypes.
	const selectProduct: PurchaseCallback = ( product: SelectorProduct, purchase ) => {
		if ( purchase ) {
			page( managePurchase( siteSlug, purchase.id ) );
			return;
		}

		const root = rootUrl.replace( ':site', siteSlug );
		const durationString = durationToString( currentDuration );

		if ( product.subtypes.length ) {
			page( `${ root }/${ product.productSlug }/${ durationString }/details` );
			return;
		}

		// Redirect to the Upsell page only if there is an upsell product and the site
		// doesn't already own the product.
		const upsellProduct = getProductUpsell( product.productSlug );
		if (
			upsellProduct &&
			! siteProducts.find( ( { productSlug } ) => productSlug === upsellProduct )
		) {
			page( `${ root }/${ product.productSlug }/${ durationString }/additions` );
			return;
		}

		checkout( siteSlug, product.productSlug );
	};

	const isInConnectFlow =
		/jetpack\/connect\/plans/.test( window.location.href ) &&
		/source=jetpack-connect-plans/.test( window.location.href );

	return (
		<Main className="selector__main" wideLayout>
			{ header }
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

			{ isInConnectFlow && (
				<>
					<div className="selector__divider" />
					<JetpackFreeCard />
				</>
			) }

			<QueryProductsList />
			{ siteId && <QuerySitePurchases siteId={ siteId } /> }
			{ siteId && <QuerySites siteId={ siteId } /> }
			{ footer }
		</Main>
	);
};

export default SelectorPage;
