/**
 * Internal dependencies
 */
import 'wp-calypso-client/state/themes/init';

/**
 * Returns whether the recommended themes list is loading.
 *
 * @param {object} state Global state tree
 *
 * @returns {boolean} whether the recommended themes list is loading
 */
export function areRecommendedThemesLoading( state ) {
	return state.themes.recommendedThemes.isLoading;
}
