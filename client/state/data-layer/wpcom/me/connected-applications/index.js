/**
 * External dependencies
 */
import { noop } from 'lodash';

/**
 * Internal dependencies
 */
import makeJsonSchemaParser from 'wp-calypso-client/lib/make-json-schema-parser';
import schema from './schema';
import { CONNECTED_APPLICATIONS_REQUEST } from 'wp-calypso-client/state/action-types';
import { dispatchRequest } from 'wp-calypso-client/state/data-layer/wpcom-http/utils';
import { http } from 'wp-calypso-client/state/data-layer/wpcom-http/actions';
import { receiveConnectedApplications } from 'wp-calypso-client/state/connected-applications/actions';

import { registerHandlers } from 'wp-calypso-client/state/data-layer/handler-registry';

export const apiTransformer = ( data ) => data.connected_applications;

/**
 * Dispatches a request to fetch connected applications of the current user
 *
 * @param   {object} action Redux action
 * @returns {object} Dispatched http action
 */
export const requestConnectedApplications = ( action ) =>
	http(
		{
			apiVersion: '1.1',
			method: 'GET',
			path: '/me/connected-applications',
		},
		action
	);

/**
 * Dispatches a user connected applications receive action when the request succeeded.
 *
 * @param   {object} action Redux action
 * @param   {object} apps   Connected applications
 * @returns {object} Dispatched user connected applications receive action
 */
export const handleRequestSuccess = ( action, apps ) => receiveConnectedApplications( apps );

registerHandlers( 'state/data-layer/wpcom/me/connected-applications/index.js', {
	[ CONNECTED_APPLICATIONS_REQUEST ]: [
		dispatchRequest( {
			fetch: requestConnectedApplications,
			onSuccess: handleRequestSuccess,
			onError: noop,
			fromApi: makeJsonSchemaParser( schema, apiTransformer, {} ),
		} ),
	],
} );
