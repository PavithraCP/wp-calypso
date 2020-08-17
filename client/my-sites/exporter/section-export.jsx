/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import EmptyContent from 'wp-calypso-client/components/empty-content';
import ExporterContainer from 'wp-calypso-client/my-sites/exporter/container';
import Main from 'wp-calypso-client/components/main';
import DocumentHead from 'wp-calypso-client/components/data/document-head';
import SidebarNavigation from 'wp-calypso-client/my-sites/sidebar-navigation';
import {
	getSelectedSite,
	getSelectedSiteId,
	getSelectedSiteSlug,
} from 'wp-calypso-client/state/ui/selectors';
import canCurrentUser from 'wp-calypso-client/state/selectors/can-current-user';
import { isJetpackSite } from 'wp-calypso-client/state/sites/selectors';
import FormattedHeader from 'wp-calypso-client/components/formatted-header';

/**
 * Style dependencies
 */
import './style.scss';

const SectionExport = ( { isJetpack, canUserExport, site, translate } ) => {
	let sectionContent;

	if ( ! canUserExport ) {
		sectionContent = (
			<EmptyContent
				illustration="/calypso/images/illustrations/illustration-404.svg"
				title={ translate( 'You are not authorized to view this page' ) }
			/>
		);
	} else if ( isJetpack ) {
		sectionContent = (
			<EmptyContent
				illustration="/calypso/images/illustrations/illustration-jetpack.svg"
				title={ translate( 'Want to export your site?' ) }
				line={ translate( "Visit your site's wp-admin for all your import and export needs." ) }
				action={ translate( 'Export %(siteTitle)s', { args: { siteTitle: site.title } } ) }
				actionURL={ site.options.admin_url + 'export.php' }
				actionTarget="_blank"
			/>
		);
	} else {
		sectionContent = (
			<Fragment>
				<FormattedHeader
					brandFont
					className="exporter__section-header"
					headerText={ translate( 'Export Content' ) }
					subHeaderText={ translate( 'Your content on WordPress.com is always yours.' ) }
					align="left"
				/>
				<ExporterContainer />
			</Fragment>
		);
	}

	return (
		<Main>
			<DocumentHead title={ translate( 'Export' ) } />
			<SidebarNavigation />
			{ sectionContent }
		</Main>
	);
};

export default connect( ( state ) => {
	const site = getSelectedSite( state );
	const siteId = getSelectedSiteId( state );

	return {
		isJetpack: isJetpackSite( state, siteId ),
		site,
		siteSlug: getSelectedSiteSlug( state ),
		canUserExport: canCurrentUser( state, siteId, 'manage_options' ),
	};
} )( localize( SectionExport ) );
