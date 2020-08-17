/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependencies
 */
import BackupRewindFlow, { RewindFlowPurpose } from './rewind-flow';
import BackupsPage from './main';
import UpsellSwitch from 'wp-calypso-client/components/jetpack/upsell-switch';
import BackupUpsell from './backup-upsell';
import WPCOMBackupUpsell from './wpcom-backup-upsell';
import BackupPlaceholder from 'wp-calypso-client/components/jetpack/backup-placeholder';
import FormattedHeader from 'wp-calypso-client/components/formatted-header';
import SidebarNavigation from 'wp-calypso-client/my-sites/sidebar-navigation';
import getRewindState from 'wp-calypso-client/state/selectors/get-rewind-state';
import QueryRewindState from 'wp-calypso-client/components/data/query-rewind-state';
import isJetpackCloud from 'wp-calypso-client/lib/jetpack/is-jetpack-cloud';
import { isJetpackBackupSlug } from 'wp-calypso-client/lib/products-values';

export function showUpsellIfNoBackup( context, next ) {
	const UpsellComponent = isJetpackCloud() ? BackupUpsell : WPCOMBackupUpsell;
	context.primary = (
		<>
			<UpsellSwitch
				UpsellComponent={ UpsellComponent }
				QueryComponent={ QueryRewindState }
				getStateForSite={ getRewindState }
				isRequestingForSite={ ( state, siteId ) =>
					'uninitialized' === getRewindState( state, siteId )?.state
				}
				display={ context.primary }
				productSlugTest={ isJetpackBackupSlug }
			>
				<SidebarNavigation />
				{ ! isJetpackCloud() && (
					<FormattedHeader brandFont headerText="Jetpack Backup" align="left" />
				) }
				<BackupPlaceholder />
			</UpsellSwitch>
		</>
	);
	next();
}

/* handles /backup/:site, see `backupMainPath` */
export function backups( context, next ) {
	const { date } = context.query;

	context.primary = <BackupsPage queryDate={ date } />;
	next();
}

/* handles /backup/:site/download/:rewindId, see `backupDownloadPath` */
export function backupDownload( context, next ) {
	context.primary = (
		<BackupRewindFlow rewindId={ context.params.rewindId } purpose={ RewindFlowPurpose.DOWNLOAD } />
	);
	next();
}

/* handles /backup/:site/restore/:rewindId, see `backupRestorePath` */
export function backupRestore( context, next ) {
	context.primary = (
		<BackupRewindFlow rewindId={ context.params.rewindId } purpose={ RewindFlowPurpose.RESTORE } />
	);
	next();
}
