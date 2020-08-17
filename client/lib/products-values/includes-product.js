/**
 * Internal dependencies
 */
import { assertValidProduct } from 'wp-calypso-client/lib/products-values/utils/assert-valid-product';
import { formatProduct } from 'wp-calypso-client/lib/products-values/format-product';

export function includesProduct( products, product ) {
	product = formatProduct( product );
	assertValidProduct( product );

	return products.indexOf( product.product_slug ) >= 0;
}
