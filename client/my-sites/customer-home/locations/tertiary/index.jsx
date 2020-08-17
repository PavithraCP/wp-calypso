/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import ManageSite from './manage-site';
import { SECTION_MANAGE_SITE } from 'wp-calypso-client/my-sites/customer-home/cards/constants';

const cardComponents = {
	[ SECTION_MANAGE_SITE ]: ManageSite,
};

const Tertiary = ( { cards } ) => {
	if ( ! cards || ! cards.length ) {
		return null;
	}

	return (
		<>
			{ cards.map(
				( card, index ) =>
					cardComponents[ card ] &&
					React.createElement( cardComponents[ card ], {
						key: index,
					} )
			) }
		</>
	);
};

export default Tertiary;
