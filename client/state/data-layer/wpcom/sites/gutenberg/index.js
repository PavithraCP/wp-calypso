/**
 * External dependencies
 */
import { has, noop } from 'lodash';

/**
 * Internal dependencies
 */
import {
	EDITOR_TYPE_REQUEST,
	EDITOR_TYPE_SET,
	EDITOR_TYPE_UPDATE,
	GUTENBERG_OPT_IN_OUT_SET,
	EDITOR_DEPRECATION_GROUP_SET,
} from 'wp-calypso-client/state/action-types';
import { dispatchRequest } from 'wp-calypso-client/state/data-layer/wpcom-http/utils';
import { http } from 'wp-calypso-client/state/data-layer/wpcom-http/actions';
import { registerHandlers } from 'wp-calypso-client/state/data-layer/handler-registry';
import { replaceHistory } from 'wp-calypso-client/state/ui/actions';

import 'wp-calypso-client/state/editor-deprecation-group/init';
import 'wp-calypso-client/state/gutenberg-opt-in-out/init';

const fetchGutenbergOptInData = ( action ) =>
	http(
		{
			method: 'GET',
			path: `/sites/${ action.siteId }/gutenberg`,
			apiNamespace: 'wpcom/v3',
		},
		action
	);

const setGutenbergOptInData = (
	{ siteId },
	{
		editor_web: editor,
		opt_in: optIn,
		opt_out: optOut,
		in_editor_deprecation_group: inEditorDeprecationGroup,
	}
) => ( dispatch ) => {
	dispatch( { type: EDITOR_TYPE_SET, siteId, editor } );
	dispatch( { type: GUTENBERG_OPT_IN_OUT_SET, siteId, optIn, optOut } );
	dispatch( { type: EDITOR_DEPRECATION_GROUP_SET, inEditorDeprecationGroup } );
};

const dispatchFetchGutenbergOptInData = dispatchRequest( {
	fetch: fetchGutenbergOptInData,
	onSuccess: setGutenbergOptInData,
	onError: noop,
} );

const updateSelectedEditor = ( action ) =>
	http(
		{
			path: `/sites/${ action.siteId }/gutenberg`,
			method: 'POST',
			apiNamespace: 'wpcom/v3',
			query: {
				editor: action.editor,
				platform: 'web',
			},
			body: {},
		},
		action
	);

const setSelectedEditorAndRedirect = (
	{ siteId, redirectUrl },
	{ editor_web: editor, opt_in: optIn, opt_out: optOut }
) => ( dispatch ) => {
	dispatch( { type: EDITOR_TYPE_SET, siteId, editor } );
	dispatch( { type: GUTENBERG_OPT_IN_OUT_SET, siteId, optIn, optOut } );

	if ( ! redirectUrl ) {
		return;
	}
	if ( has( window, 'location.replace' ) && -1 !== redirectUrl.indexOf( 'calypsoify=1' ) ) {
		return window.location.replace( redirectUrl );
	}

	dispatch( replaceHistory( redirectUrl ) );
};

const dispatchUpdateSelectedEditor = dispatchRequest( {
	fetch: updateSelectedEditor,
	onSuccess: setSelectedEditorAndRedirect,
	onError: noop,
} );

registerHandlers( 'state/data-layer/wpcom/sites/gutenberg/index.js', {
	[ EDITOR_TYPE_REQUEST ]: [ dispatchFetchGutenbergOptInData ],
	[ EDITOR_TYPE_UPDATE ]: [ dispatchUpdateSelectedEditor ],
} );
