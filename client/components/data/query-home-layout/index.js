/**
 * External dependencies
 */
import React from 'react';
import { useDispatch } from 'react-redux';

/**
 * Internal dependencies
 */
import { requestHomeLayout } from 'wp-calypso-client/state/home/actions';

export default function QueryHomeLayout( { isDev, forcedView, siteId } ) {
	const dispatch = useDispatch();
	React.useEffect( () => {
		dispatch( requestHomeLayout( siteId, isDev, forcedView ) );
	}, [ dispatch, siteId ] );

	return null;
}
