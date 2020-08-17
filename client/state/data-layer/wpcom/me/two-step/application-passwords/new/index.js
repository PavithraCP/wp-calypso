/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import makeJsonSchemaParser from 'wp-calypso-client/lib/make-json-schema-parser';
import schema from './schema';
import { APPLICATION_PASSWORD_CREATE } from 'wp-calypso-client/state/action-types';
import { dispatchRequest } from 'wp-calypso-client/state/data-layer/wpcom-http/utils';
import { errorNotice } from 'wp-calypso-client/state/notices/actions';
import { http } from 'wp-calypso-client/state/data-layer/wpcom-http/actions';
import {
	createApplicationPasswordSuccess,
	requestApplicationPasswords,
} from 'wp-calypso-client/state/application-passwords/actions';

import { registerHandlers } from 'wp-calypso-client/state/data-layer/handler-registry';

export const apiTransformer = ( data ) => data.application_password;

/**
 * Dispatches a request to add an application password for the current user
 *
 * @param   {object} action Redux action
 * @returns {object} Dispatched http action
 */
export const addApplicationPassword = ( action ) =>
	http(
		{
			apiVersion: '1.1',
			method: 'POST',
			path: '/me/two-step/application-passwords/new',
			body: {
				application_name: action.applicationName,
			},
		},
		action
	);

/**
 * Dispatches the following actions when the request succeeded:
 * - a create application password success action
 * - a user application passwords receive action
 *
 * @param   {object} action      Redux action
 * @param   {Array}  appPassword Response from the endpoint
 * @returns {Array}              Dispatched actions
 */
export const handleAddSuccess = ( action, appPassword ) => [
	createApplicationPasswordSuccess( appPassword ),
	requestApplicationPasswords(),
];

/**
 * Dispatches an error notice when the request failed.
 *
 * @returns {object} Dispatched error notice action
 */
export const handleAddError = () =>
	errorNotice(
		translate( 'There was a problem creating your application password. Please try again.' ),
		{
			duration: 8000,
		}
	);

registerHandlers( 'state/data-layer/wpcom/me/two-step/application-passwords/new/index.js', {
	[ APPLICATION_PASSWORD_CREATE ]: [
		dispatchRequest( {
			fetch: addApplicationPassword,
			onSuccess: handleAddSuccess,
			onError: handleAddError,
			fromApi: makeJsonSchemaParser( schema, apiTransformer ),
		} ),
	],
} );
