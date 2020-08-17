/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import ReaderShare from 'wp-calypso-client/blocks/reader-share';
import { Card } from '@automattic/components';
import { posts } from 'wp-calypso-client/blocks/reader-post-card/docs/fixtures';

const ReaderShareExample = () => (
	<div className="design-assets__group" style={ { width: '100px' } }>
		<ReaderShare post={ posts[ 0 ] } tagName="div" />
	</div>
);

ReaderShareExample.displayName = 'ReaderShare';

export default ReaderShareExample;
