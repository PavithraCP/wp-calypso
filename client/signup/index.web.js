/**
 * External dependencies
 */
import page from 'page';

/**
 * Internal dependencies
 */
import controller from './controller';
import { makeLayout, render as clientRender } from 'wp-calypso-client/controller';
import { getLanguageRouteParam } from 'wp-calypso-client/lib/i18n-utils';

export default function () {
	const lang = getLanguageRouteParam();

	page(
		[
			`/start/${ lang }`,
			`/start/:flowName/${ lang }`,
			`/start/:flowName/:stepName/${ lang }`,
			`/start/:flowName/:stepName/:stepSectionName/${ lang }`,
		],
		controller.redirectTests,
		controller.saveInitialContext,
		controller.redirectWithoutLocaleIfLoggedIn,
		controller.redirectToFlow,
		controller.start,
		controller.importSiteInfoFromQuery,
		makeLayout,
		clientRender
	);
}
