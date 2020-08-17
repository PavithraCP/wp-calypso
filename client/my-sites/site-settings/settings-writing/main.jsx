/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DocumentHead from 'wp-calypso-client/components/data/document-head';
import JetpackDevModeNotice from 'wp-calypso-client/my-sites/site-settings/jetpack-dev-mode-notice';
import Main from 'wp-calypso-client/components/main';
import SidebarNavigation from 'wp-calypso-client/my-sites/sidebar-navigation';
import FormattedHeader from 'wp-calypso-client/components/formatted-header';
import SiteSettingsNavigation from 'wp-calypso-client/my-sites/site-settings/navigation';
import WritingForm from 'wp-calypso-client/my-sites/site-settings/form-writing';
import { getSelectedSite } from 'wp-calypso-client/state/ui/selectors';

const SiteSettingsWriting = ( { site, translate } ) => (
	<Main className="settings-writing site-settings">
		<DocumentHead title={ translate( 'Site Settings' ) } />
		<JetpackDevModeNotice />
		<SidebarNavigation />
		<FormattedHeader
			brandFont
			className="settings-writing__page-heading"
			headerText={ translate( 'Settings' ) }
			align="left"
		/>
		<SiteSettingsNavigation site={ site } section="writing" />
		<WritingForm />
	</Main>
);

export default connect( ( state ) => ( {
	site: getSelectedSite( state ),
} ) )( localize( SiteSettingsWriting ) );
