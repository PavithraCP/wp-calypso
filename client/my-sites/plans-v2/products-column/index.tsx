/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Internal dependencies
 */
import {
	durationToText,
	slugToItem,
	itemToSelectorProduct,
	productButtonLabel,
	productBadgeLabel,
	getProductPrices,
} from '../utils';
import { PRODUCTS_TYPES, SELECTOR_PRODUCTS } from '../constants';
import {
	isProductsListFetching,
	getAvailableProductsList,
} from 'wp-calypso-client/state/products-list/selectors';
import { getCurrentUserCurrencyCode } from 'wp-calypso-client/state/current-user/selectors';
import getSitePlan from 'wp-calypso-client/state/sites/selectors/get-site-plan';
import getSiteProducts from 'wp-calypso-client/state/sites/selectors/get-site-products';
import JetpackProductCard from 'wp-calypso-client/components/jetpack/card/jetpack-product-card';
import FormattedHeader from 'wp-calypso-client/components/formatted-header';

/**
 * Type dependencies
 */
import type { Duration, PurchaseCallback, ProductType, SelectorProduct } from '../types';

interface ProductsColumnType {
	duration: Duration;
	onProductClick: PurchaseCallback;
	productType: ProductType;
	siteId: number | null;
}

const ProductComponent = ( {
	product,
	currentPlan,
	onClick,
	currencyCode,
}: {
	product: SelectorProduct;
	currentPlan: string | null;
	onClick: PurchaseCallback;
	currencyCode: string;
} ) => (
	<JetpackProductCard
		iconSlug={ product.iconSlug }
		productName={ product.displayName }
		subheadline={ product.tagline }
		description={ product.description }
		currencyCode={ currencyCode }
		billingTimeFrame={ durationToText( product.term ) }
		badgeLabel={ productBadgeLabel( product, currentPlan ) }
		buttonLabel={ productButtonLabel( product ) }
		onButtonClick={ () => onClick( product ) }
		features={ { items: [] } }
		discountedPrice={ product.discountCost }
		originalPrice={ product.cost || 0 }
		withStartingPrice={ product.subtypes && product.subtypes.length > 0 }
		isOwned={ product.owned }
	/>
);

const ProductsColumn = ( {
	duration,
	onProductClick,
	productType,
	siteId,
}: ProductsColumnType ) => {
	const currencyCode = useSelector( ( state ) => getCurrentUserCurrencyCode( state ) );
	const isFetchingProducts = useSelector( ( state ) => isProductsListFetching( state ) );
	const availableProducts = useSelector( ( state ) => getAvailableProductsList( state ) );
	const currentProducts = (
		useSelector( ( state ) => getSiteProducts( state, siteId ) ) || []
	).map( ( product ) => product.productSlug );
	const currentPlan =
		useSelector( ( state ) => getSitePlan( state, siteId ) )?.product_slug || null;

	// Gets all products in an array to be parsed.
	const productObjects: SelectorProduct[] = useMemo(
		() =>
			// Convert product slugs to ProductSelector types.
			SELECTOR_PRODUCTS.map( ( productSlug ) => {
				const item = slugToItem( productSlug );
				return item && itemToSelectorProduct( item );
			} )
				// Remove products that don't fit the filters or have invalid data.
				.filter(
					( product: SelectorProduct | null ): product is SelectorProduct =>
						!! product &&
						duration === product.term &&
						PRODUCTS_TYPES[ productType ].includes( product.productSlug )
				)
				// Insert product prices as well as whether they are owned already.
				.map( ( product: SelectorProduct ) => ( {
					...product,
					...getProductPrices( product, availableProducts ),
					owned: currentProducts.includes( product.productSlug ),
				} ) ),
		[ duration, productType, currentProducts, availableProducts ]
	);

	if ( ! currencyCode || isFetchingProducts ) {
		return null; // TODO: Loading component!
	}

	return (
		<div className="plans-column products-column">
			<FormattedHeader headerText={ translate( 'Individual Products' ) } brandFont />
			{ productObjects.map( ( product ) => (
				<ProductComponent
					key={ product.productSlug }
					onClick={ onProductClick }
					product={ product }
					currentPlan={ currentPlan }
					currencyCode={ currencyCode }
				/>
			) ) }
		</div>
	);
};

export default ProductsColumn;
