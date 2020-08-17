/**
 * Internal dependencies
 */
import { assertValidProduct } from 'wp-calypso-client/lib/products-values/utils/assert-valid-product';
import { formatProduct } from 'wp-calypso-client/lib/products-values/format-product';
import { getJetpackProductsDisplayNames } from 'wp-calypso-client/lib/products-values/translations';

/**
 * Get Jetpack product display name based on the product purchase object.
 *
 * @param   product {object}             Product purchase object
 * @returns         {string|object} Product display name
 */
export function getJetpackProductDisplayName( product ) {
	product = formatProduct( product );
	assertValidProduct( product );
	const jetpackProductsDisplayNames = getJetpackProductsDisplayNames();

	return jetpackProductsDisplayNames?.[ product.product_slug ];
}
