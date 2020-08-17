/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { http } from 'wp-calypso-client/state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'wp-calypso-client/state/data-layer/wpcom-http/utils';
import { errorNotice, successNotice } from 'wp-calypso-client/state/notices/actions';
import {
	READER_LIST_CREATE,
	READER_LIST_UPDATE,
} from 'wp-calypso-client/state/reader/action-types';
import {
	handleReaderListRequestFailure,
	handleUpdateListDetailsError,
	receiveReaderList,
	receiveUpdatedListDetails,
} from 'wp-calypso-client/state/reader/lists/actions';
import { registerHandlers } from 'wp-calypso-client/state/data-layer/handler-registry';
import { navigate } from 'wp-calypso-client/state/ui/actions';

registerHandlers( 'state/data-layer/wpcom/read/lists/index.js', {
	[ READER_LIST_CREATE ]: [
		dispatchRequest( {
			fetch: ( action ) =>
				http(
					{
						method: 'POST',
						path: `/read/lists/new`,
						apiVersion: '1.2',
						body: {
							title: action.list.title,
							description: action.list.description,
							is_public: action.list.is_public,
						},
					},
					action
				),
			onSuccess: ( action, response ) => [
				receiveReaderList( { list: response.list } ),
				navigate( `/read/list/${ response.list.owner }/${ response.list.slug }/edit` ),
			],
			onError: ( action, error ) => [
				errorNotice( String( error ) ),
				handleReaderListRequestFailure( error ),
			],
		} ),
	],
	[ READER_LIST_UPDATE ]: [
		dispatchRequest( {
			fetch: ( action ) => {
				return http(
					{
						method: 'POST',
						path: `/read/lists/${ action.list.owner }/${ action.list.slug }/update`,
						apiVersion: '1.2',
						body: action.list,
					},
					action
				);
			},
			onSuccess: ( action, response ) => [
				receiveUpdatedListDetails( response ),
				successNotice( translate( 'List updated successfully!' ) ),
			],
			onError: ( action, error ) => [
				errorNotice( String( error ) ),
				handleUpdateListDetailsError( error ),
			],
		} ),
	],
} );
