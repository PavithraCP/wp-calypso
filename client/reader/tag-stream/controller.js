/**
 * External dependencies
 */
import React from 'react';
import { trim } from 'lodash';

/**
 * Internal dependencies
 */
import { recordTrack } from 'wp-calypso-client/reader/stats';
import {
	trackPageLoad,
	trackUpdatesLoaded,
	trackScrollPage,
	getStartDate,
} from 'wp-calypso-client/reader/controller-helper';
import AsyncLoad from 'wp-calypso-client/components/async-load';
import { TAG_PAGE } from 'wp-calypso-client/reader/follow-sources';

const analyticsPageTitle = 'Reader';

export const tagListing = ( context, next ) => {
	const basePath = '/tag/:slug';
	const fullAnalyticsPageTitle = analyticsPageTitle + ' > Tag > ' + context.params.tag;
	const tagSlug = trim( context.params.tag )
		.toLowerCase()
		.replace( /\s+/g, '-' )
		.replace( /-{2,}/g, '-' );
	const encodedTag = encodeURIComponent( tagSlug ).toLowerCase();
	const streamKey = 'tag:' + tagSlug;
	const mcKey = 'topic';
	const startDate = getStartDate( context );

	trackPageLoad( basePath, fullAnalyticsPageTitle, mcKey );
	recordTrack( 'calypso_reader_tag_loaded', {
		tag: tagSlug,
	} );

	context.primary = (
		<AsyncLoad
			require="wp-calypso-client/reader/tag-stream/main"
			key={ 'tag-' + encodedTag }
			streamKey={ streamKey }
			encodedTagSlug={ encodedTag }
			decodedTagSlug={ tagSlug }
			trackScrollPage={ trackScrollPage.bind(
				// eslint-disable-line
				null,
				basePath,
				fullAnalyticsPageTitle,
				analyticsPageTitle,
				mcKey
			) }
			startDate={ startDate }
			onUpdatesShown={ trackUpdatesLoaded.bind( null, mcKey ) } // eslint-disable-line
			showBack={ !! context.lastRoute }
			showPrimaryFollowButtonOnCards={ true }
			followSource={ TAG_PAGE }
		/>
	);
	next();
};
