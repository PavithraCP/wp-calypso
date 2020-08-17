/**
 * Internal dependencies
 */
import { ANALYTICS_MULTI_TRACK } from 'wp-calypso-client/state/action-types';

/**
 * External dependencies
 */
import { flatMap, property } from 'lodash';

export function composeAnalytics( ...analytics ) {
	return {
		type: ANALYTICS_MULTI_TRACK,
		meta: {
			analytics: flatMap( analytics, property( 'meta.analytics' ) ),
		},
	};
}
