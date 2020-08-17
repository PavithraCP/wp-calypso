/**
 * External dependencies
 */

import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import { flowRight } from 'lodash';

/**
 * Internal dependencies
 */
import ExtensionRedirect from 'wp-calypso-client/blocks/extension-redirect';
import DocumentHead from 'wp-calypso-client/components/data/document-head';
import Main from 'wp-calypso-client/components/main';
import { getSelectedSiteId } from 'wp-calypso-client/state/ui/selectors';
import { ZONINATOR_MIN_VERSION } from '../../app/constants';
import QueryZones from '../data/query-zones';

const Settings = ( { children, siteId, translate } ) => {
	const mainClassName = 'zoninator__main';

	return (
		<Main className={ mainClassName }>
			<ExtensionRedirect
				pluginId="zoninator"
				siteId={ siteId }
				minimumVersion={ ZONINATOR_MIN_VERSION }
			/>
			<QueryZones siteId={ siteId } />
			<DocumentHead title={ translate( 'WP Zone Manager' ) } />
			{ children }
		</Main>
	);
};

const connectComponent = connect( ( state ) => ( {
	siteId: getSelectedSiteId( state ),
} ) );

export default flowRight( connectComponent, localize )( Settings );
