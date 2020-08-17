/**
 * Internal dependencies
 */
import { type } from 'wp-calypso-client/lib/domains/constants';
import {
	domainManagementEdit,
	domainManagementSiteRedirect,
	domainManagementTransferIn,
} from 'wp-calypso-client/my-sites/domains/paths';

export const getDomainManagementPath = ( domainName, domainType, siteSlug, currentRoute ) => {
	switch ( domainType ) {
		case type.TRANSFER:
			return domainManagementTransferIn( siteSlug, domainName, currentRoute );

		case type.SITE_REDIRECT:
			return domainManagementSiteRedirect( siteSlug, domainName, currentRoute );

		default:
			return domainManagementEdit( siteSlug, domainName, currentRoute );
	}
};
