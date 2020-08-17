/**
 * Internal dependencies
 */
import { assertValidProduct } from 'wp-calypso-client/lib/products-values/utils/assert-valid-product';
import { formatProduct } from 'wp-calypso-client/lib/products-values/format-product';

export function isSiteRedirect( product ) {
	product = formatProduct( product );
	assertValidProduct( product );

	return product.product_slug === 'offsite_redirect';
}
