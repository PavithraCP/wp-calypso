/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import page from 'page';
import { connect } from 'react-redux';
import { get, flowRight } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import DocumentHead from 'wp-calypso-client/components/data/document-head';
import HelpButton from './help-button';
import JetpackConnectHappychatButton from './happychat-button';
import LoggedOutFormLinks from 'wp-calypso-client/components/logged-out-form/links';
import Placeholder from './plans-placeholder';
import PlansGrid from './plans-grid';
import QueryPlans from 'wp-calypso-client/components/data/query-plans';
import QuerySitePlans from 'wp-calypso-client/components/data/query-site-plans';
import QueryProductsList from 'wp-calypso-client/components/data/query-products-list';
import { addItem } from 'wp-calypso-client/lib/cart/actions';
import { addQueryArgs } from 'wp-calypso-client/lib/route';
import { clearPlan, isCalypsoStartedConnection, retrievePlan } from './persistence-utils';
import { completeFlow } from 'wp-calypso-client/state/jetpack-connect/actions';
import { externalRedirect } from 'wp-calypso-client/lib/route/path';
import { getCurrentUser } from 'wp-calypso-client/state/current-user/selectors';
import { getPlanBySlug } from 'wp-calypso-client/state/plans/selectors';
import { getProductBySlug } from 'wp-calypso-client/state/products-list/selectors';
import { getSelectedSite } from 'wp-calypso-client/state/ui/selectors';
import { isCurrentPlanPaid, isJetpackSite } from 'wp-calypso-client/state/sites/selectors';
import { JPC_PATH_PLANS } from './constants';
import { bumpStat } from 'wp-calypso-client/lib/analytics/mc';
import { PLAN_JETPACK_FREE } from 'wp-calypso-client/lib/plans/constants';
import { recordTracksEvent } from 'wp-calypso-client/state/analytics/actions';
import canCurrentUser from 'wp-calypso-client/state/selectors/can-current-user';
import hasInitializedSites from 'wp-calypso-client/state/selectors/has-initialized-sites';
import isSiteAutomatedTransfer from 'wp-calypso-client/state/selectors/is-site-automated-transfer';
import { persistSignupDestination } from 'wp-calypso-client/signup/utils';
import { isJetpackProductSlug as getJetpackProductSlug } from 'wp-calypso-client/lib/products-values';

const CALYPSO_PLANS_PAGE = '/plans/';
const CALYPSO_MY_PLAN_PAGE = '/plans/my-plan/';
const CALYPSO_REDIRECTION_PAGE = '/posts/';
const JETPACK_ADMIN_PATH = '/wp-admin/admin.php?page=jetpack';

class Plans extends Component {
	static propTypes = {
		queryRedirect: PropTypes.string,

		// Connected props
		hasPlan: PropTypes.bool, // null indicates unknown
		isAutomatedTransfer: PropTypes.bool, // null indicates unknown
	};

	redirecting = false;

	componentDidMount() {
		this.maybeRedirect();
		if ( ! this.redirecting ) {
			this.props.recordTracksEvent( 'calypso_jpc_plans_view', {
				user: this.props.userId,
			} );
		}
	}

	componentDidUpdate() {
		if ( ! this.redirecting ) {
			this.maybeRedirect();
		}
	}

	maybeRedirect() {
		if ( this.props.isAutomatedTransfer ) {
			return externalRedirect( this.props.selectedSite.URL + JETPACK_ADMIN_PATH );
		}
		if ( this.props.selectedPlan ) {
			return this.selectPlan( this.props.selectedPlan );
		}
		if ( ( this.props.hasPlan && ! this.props.product_slug ) || this.props.notJetpack ) {
			return this.redirect( CALYPSO_PLANS_PAGE );
		}
		if ( ! this.props.selectedSite && this.props.isSitesInitialized ) {
			// Invalid site
			return this.redirect( JPC_PATH_PLANS );
		}
		if ( ! this.props.canPurchasePlans ) {
			if ( this.props.calypsoStartedConnection ) {
				return this.redirectToCalypso();
			}
			return this.redirectToWpAdmin();
		}
	}

	redirectToCalypso() {
		const { canPurchasePlans, selectedSiteSlug } = this.props;

		if ( selectedSiteSlug && canPurchasePlans ) {
			return this.redirect( CALYPSO_MY_PLAN_PAGE, null, { 'thank-you': '' } );
		}

		return this.redirect( CALYPSO_REDIRECTION_PAGE );
	}

	handleSkipButtonClick = () => {
		this.props.recordTracksEvent( 'calypso_jpc_plans_skip_button_click' );

		this.selectFreeJetpackPlan();
	};

	redirectToWpAdmin() {
		const { queryRedirect } = this.props;
		if ( queryRedirect ) {
			externalRedirect( queryRedirect );
			this.redirecting = true;
			this.props.completeFlow();
		} else if ( this.props.selectedSite ) {
			externalRedirect( this.props.selectedSite.URL + JETPACK_ADMIN_PATH );
			this.redirecting = true;
			this.props.completeFlow();
		}
	}

	getMyPlansDestination() {
		const redirectTo = CALYPSO_MY_PLAN_PAGE + this.props.selectedSiteSlug;
		const args = { 'thank-you': '', install: 'all' };

		return addQueryArgs( args, redirectTo );
	}

	redirect( path, product, args ) {
		let redirectTo = path + this.props.selectedSiteSlug;

		if ( product ) {
			redirectTo += '/' + product;
		}

		if ( args ) {
			redirectTo = addQueryArgs( args, redirectTo );
		}

		page.redirect( redirectTo );
		this.redirecting = true;
		this.props.completeFlow();
	}

	selectFreeJetpackPlan() {
		clearPlan();
		this.props.recordTracksEvent( 'calypso_jpc_plans_submit_free', {
			user: this.props.userId,
		} );
		bumpStat( 'calypso_jpc_plan_selection', 'jetpack_free' );

		this.redirectToCalypso();
	}

	selectPlan = ( cartItem ) => {
		clearPlan();
		if ( ! cartItem || cartItem.product_slug === PLAN_JETPACK_FREE ) {
			return this.selectFreeJetpackPlan();
		}

		if ( cartItem.product_slug === get( this.props, 'selectedSite.plan.product_slug', null ) ) {
			return this.redirect( CALYPSO_PLANS_PAGE );
		}

		this.props.recordTracksEvent( 'calypso_jpc_plans_submit', {
			user: this.props.userId,
			product_slug: cartItem.product_slug,
		} );
		bumpStat( 'calypso_jpc_plan_selection', cartItem.product_slug );

		addItem( cartItem );
		this.props.completeFlow();
		persistSignupDestination( this.getMyPlansDestination() );

		this.redirect( '/checkout/', cartItem.product_slug );
	};

	shouldShowPlaceholder() {
		return (
			this.redirecting ||
			this.props.selectedPlanSlug ||
			false !== this.props.notJetpack ||
			! this.props.canPurchasePlans ||
			false !== this.props.hasPlan ||
			false !== this.props.isAutomatedTransfer
		);
	}

	handleInfoButtonClick = ( info ) => () => {
		this.props.recordTracksEvent( 'calypso_jpc_external_help_click', {
			help_type: info,
		} );
	};

	render() {
		const { interval, selectedSite, translate } = this.props;

		if ( this.shouldShowPlaceholder() ) {
			return (
				<Fragment>
					<QueryPlans />
					<QueryProductsList />
					<Placeholder />
				</Fragment>
			);
		}

		const helpButtonLabel = translate( 'Need help?' );

		return (
			<Fragment>
				<DocumentHead title={ translate( 'Plans' ) } />
				<QueryPlans />
				{ selectedSite && <QuerySitePlans siteId={ selectedSite.ID } /> }
				<PlansGrid
					basePlansPath={ this.props.basePlansPath }
					onSelect={ this.selectPlan }
					hideFreePlan={ true }
					isLanding={ false }
					interval={ interval }
					selectedSite={ selectedSite }
				>
					<LoggedOutFormLinks>
						<JetpackConnectHappychatButton
							label={ helpButtonLabel }
							eventName="calypso_jpc_plans_chat_initiated"
						>
							<HelpButton label={ helpButtonLabel } />
						</JetpackConnectHappychatButton>
					</LoggedOutFormLinks>
				</PlansGrid>
			</Fragment>
		);
	}
}

export { Plans as PlansTestComponent };

const connectComponent = connect(
	( state ) => {
		const user = getCurrentUser( state );
		const selectedSite = getSelectedSite( state );
		const selectedSiteSlug = selectedSite ? selectedSite.slug : '';

		const selectedPlanSlug = retrievePlan();
		const isJetpackProductSlug = getJetpackProductSlug( selectedPlanSlug );

		const selectedPlan = isJetpackProductSlug
			? getProductBySlug( state, selectedPlanSlug )
			: getPlanBySlug( state, selectedPlanSlug );

		return {
			calypsoStartedConnection: isCalypsoStartedConnection( selectedSiteSlug ),
			canPurchasePlans: selectedSite
				? canCurrentUser( state, selectedSite.ID, 'manage_options' )
				: true,
			hasPlan: selectedSite ? isCurrentPlanPaid( state, selectedSite.ID ) : null,
			isAutomatedTransfer: selectedSite ? isSiteAutomatedTransfer( state, selectedSite.ID ) : null,
			isSitesInitialized: hasInitializedSites( state ),
			notJetpack: selectedSite ? ! isJetpackSite( state, selectedSite.ID ) : null,
			selectedPlan,
			selectedPlanSlug,
			selectedSite,
			selectedSiteSlug,
			userId: user ? user.ID : null,
		};
	},
	{
		completeFlow,
		recordTracksEvent,
	}
);

export default flowRight( connectComponent, localize )( Plans );
