/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { dispatchRequest } from 'wp-calypso-client/state/data-layer/wpcom-http/utils';
import { http } from 'wp-calypso-client/state/data-layer/wpcom-http/actions';
import { SITE_LAUNCH } from 'wp-calypso-client/state/action-types';
import { receiveSite } from 'wp-calypso-client/state/sites/actions';
import { updateSiteSettings } from 'wp-calypso-client/state/site-settings/actions';
import { errorNotice, infoNotice, successNotice } from 'wp-calypso-client/state/notices/actions';
import { registerHandlers } from 'wp-calypso-client/state/data-layer/handler-registry';
import { requestSiteChecklist } from 'wp-calypso-client/state/checklist/actions';
import { requestEligibility } from 'wp-calypso-client/state/automated-transfer/actions';

const handleLaunchSiteRequest = dispatchRequest( {
	fetch: ( action ) => [
		infoNotice( translate( 'Launching your site…' ), { duration: 1000 } ),
		http(
			{
				method: 'POST',
				path: `/sites/${ action.siteId }/launch`,
			},
			action
		),
	],
	onSuccess: ( action, data ) => [
		receiveSite( data ),
		updateSiteSettings( data.ID, data.options ),
		requestSiteChecklist( data.ID ),
		requestEligibility( data.ID ),
		successNotice(
			translate( 'Your site has been launched; now you can share it with the world!' ),
			{
				duration: 5000,
			}
		),
	],
	onError: ( action, data ) => errorNotice( data.message, { duration: 5000 } ),
} );

registerHandlers( 'state/data-layer/wpcom/sites/launch/index.js', {
	[ SITE_LAUNCH ]: [ handleLaunchSiteRequest ],
} );
