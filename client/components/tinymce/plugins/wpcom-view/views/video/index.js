/**
 * Internal dependencies
 */
import { next } from 'wp-calypso-client/lib/shortcode';
import VideoView from './view';

export function match( content ) {
	const nextMatch = next( 'wpvideo', content );

	if ( nextMatch ) {
		return {
			index: nextMatch.index,
			content: nextMatch.content,
			options: {
				shortcode: nextMatch.shortcode,
			},
		};
	}
}

export function serialize( content ) {
	return encodeURIComponent( content );
}

export function getComponent() {
	return VideoView;
}
