/**
 * Internal dependencies
 */
import { SITE_LAUNCH } from 'wp-calypso-client/state/action-types';
import { launchSite } from 'wp-calypso-client/state/sites/launch/actions';

describe( 'actions', () => {
	describe( '#launchSite', () => {
		test( 'should return an action when a site is launched', () => {
			const action = launchSite( 123 );
			expect( action ).toEqual( {
				type: SITE_LAUNCH,
				siteId: 123,
				meta: {
					dataLayer: {
						requestKey: 'SITE_LAUNCH-123',
						trackRequest: true,
					},
				},
			} );
		} );
	} );
} );
