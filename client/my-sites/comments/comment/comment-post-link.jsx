/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'wp-calypso-client/components/gridicon';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import CommentLink from 'wp-calypso-client/my-sites/comments/comment/comment-link';
import QueryPosts from 'wp-calypso-client/components/data/query-posts';
import { decodeEntities, stripHTML } from 'wp-calypso-client/lib/formatting';
import { getSiteComment } from 'wp-calypso-client/state/comments/selectors';
import { getSitePost } from 'wp-calypso-client/state/posts/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'wp-calypso-client/state/ui/selectors';

const CommentPostLink = ( {
	commentId,
	isBulkMode,
	isPostTitleLoaded,
	postId,
	postTitle,
	siteId,
	siteSlug,
	status,
	translate,
} ) => (
	<div className="comment__post-link">
		{ ! isPostTitleLoaded && <QueryPosts siteId={ siteId } postId={ postId } /> }

		<Gridicon icon={ isBulkMode ? 'chevron-right' : 'posts' } size={ 18 } />

		<CommentLink
			commentId={ commentId }
			href={ `/comments/${ status }/${ siteSlug }/${ postId }` }
			tabIndex={ isBulkMode ? -1 : 0 }
		>
			{ postTitle.trim() || translate( 'Untitled' ) }
		</CommentLink>
	</div>
);

const mapStateToProps = ( state, { commentId } ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state );

	const comment = getSiteComment( state, siteId, commentId );
	const commentStatus = get( comment, 'status' );

	const postId = get( comment, 'post.ID' );
	const post = getSitePost( state, siteId, postId );
	const postTitle =
		decodeEntities( get( comment, 'post.title' ) ) ||
		decodeEntities( stripHTML( get( post, 'excerpt' ) ) );

	return {
		isPostTitleLoaded: !! postTitle || !! post,
		postId,
		postTitle,
		siteSlug,
		siteId,
		status: 'unapproved' === commentStatus ? 'pending' : commentStatus,
	};
};

export default connect( mapStateToProps )( localize( CommentPostLink ) );
