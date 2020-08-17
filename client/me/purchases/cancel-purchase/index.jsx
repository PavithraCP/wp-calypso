/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal Dependencies
 */
import { Card, CompactCard } from '@automattic/components';
import CancelPurchaseButton from './button';
import CancelPurchaseLoadingPlaceholder from 'wp-calypso-client/me/purchases/cancel-purchase/loading-placeholder';
import CancelPurchaseRefundInformation from './refund-information';
import {
	getName,
	hasAmountAvailableToRefund,
	isCancelable,
	isOneTimePurchase,
	isRefundable,
	isSubscription,
} from 'wp-calypso-client/lib/purchases';
import { isDataLoading } from 'wp-calypso-client/me/purchases/utils';
import {
	getByPurchaseId,
	hasLoadedUserPurchasesFromServer,
	getIncludedDomainPurchase,
} from 'wp-calypso-client/state/purchases/selectors';
import HeaderCake from 'wp-calypso-client/components/header-cake';
import { isDomainRegistration, isDomainTransfer } from 'wp-calypso-client/lib/products-values';
import { isRequestingSites, getSite } from 'wp-calypso-client/state/sites/selectors';
import Main from 'wp-calypso-client/components/main';
import { managePurchase, purchasesRoot } from 'wp-calypso-client/me/purchases/paths';
import QueryUserPurchases from 'wp-calypso-client/components/data/query-user-purchases';
import { withLocalizedMoment } from 'wp-calypso-client/components/localized-moment';
import ProductLink from 'wp-calypso-client/me/purchases/product-link';
import titles from 'wp-calypso-client/me/purchases/titles';
import TrackPurchasePageView from 'wp-calypso-client/me/purchases/track-purchase-page-view';
import { getCurrentUserId } from 'wp-calypso-client/state/current-user/selectors';

/**
 * Style dependencies
 */
import './style.scss';

class CancelPurchase extends React.Component {
	static propTypes = {
		hasLoadedSites: PropTypes.bool.isRequired,
		hasLoadedUserPurchasesFromServer: PropTypes.bool.isRequired,
		includedDomainPurchase: PropTypes.object,
		purchase: PropTypes.object,
		purchaseId: PropTypes.number.isRequired,
		site: PropTypes.object,
		siteSlug: PropTypes.string.isRequired,
		userId: PropTypes.number,
	};

	state = {
		cancelBundledDomain: false,
		confirmCancelBundledDomain: false,
	};

	UNSAFE_componentWillMount() {
		if ( ! this.isDataValid() ) {
			this.redirect( this.props );
			return;
		}
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( this.isDataValid() && ! this.isDataValid( nextProps ) ) {
			this.redirect( nextProps );
			return;
		}
	}

	isDataValid = ( props = this.props ) => {
		if ( isDataLoading( props ) ) {
			return true;
		}

		const { purchase } = props;

		// For domain transfers, we only allow cancel if it's also refundable
		const isDomainTransferCancelable = isRefundable( purchase ) || ! isDomainTransfer( purchase );

		return purchase && isCancelable( purchase ) && isDomainTransferCancelable;
	};

	redirect = ( props ) => {
		const { purchase, siteSlug } = props;
		let redirectPath = purchasesRoot;

		if ( siteSlug && purchase && ( ! isCancelable( purchase ) || isDomainTransfer( purchase ) ) ) {
			redirectPath = managePurchase( siteSlug, purchase.id );
		}

		page.redirect( redirectPath );
	};

	onCancelConfirmationStateChange = ( newState ) => {
		this.setState( newState );
	};

	renderFooterText = () => {
		const { purchase } = this.props;
		const { refundText, expiryDate, totalRefundText } = purchase;

		if ( hasAmountAvailableToRefund( purchase ) ) {
			if ( this.state.cancelBundledDomain && this.props.includedDomainPurchase ) {
				return this.props.translate( '%(refundText)s to be refunded', {
					args: { refundText: totalRefundText },
					context: 'refundText is of the form "[currency-symbol][amount]" i.e. "$20"',
				} );
			}
			return this.props.translate( '%(refundText)s to be refunded', {
				args: { refundText },
				context: 'refundText is of the form "[currency-symbol][amount]" i.e. "$20"',
			} );
		}

		const expirationDate = this.props.moment( expiryDate ).format( 'LL' );

		if ( isDomainRegistration( purchase ) ) {
			return this.props.translate(
				'After you confirm this change, the domain will be removed on %(expirationDate)s',
				{
					args: { expirationDate },
				}
			);
		}

		return this.props.translate(
			'After you confirm this change, the subscription will be removed on %(expirationDate)s',
			{
				args: { expirationDate },
			}
		);
	};

	render() {
		if ( ! this.isDataValid() ) {
			return null;
		}

		if ( isDataLoading( this.props ) ) {
			return (
				<div>
					<QueryUserPurchases userId={ this.props.userId } />
					<CancelPurchaseLoadingPlaceholder
						purchaseId={ this.props.purchaseId }
						siteSlug={ this.props.siteSlug }
					/>
				</div>
			);
		}

		const { purchase } = this.props;
		const purchaseName = getName( purchase );
		const { siteName, domain: siteDomain } = purchase;

		let heading;

		if ( isDomainRegistration( purchase ) || isOneTimePurchase( purchase ) ) {
			heading = this.props.translate( 'Cancel %(purchaseName)s', {
				args: { purchaseName },
			} );
		}

		if ( isSubscription( purchase ) ) {
			heading = this.props.translate( 'Cancel Your %(purchaseName)s Subscription', {
				args: { purchaseName },
			} );
		}

		return (
			<Main className="cancel-purchase">
				<TrackPurchasePageView
					eventName="calypso_cancel_purchase_purchase_view"
					purchaseId={ this.props.purchaseId }
				/>
				<HeaderCake backHref={ managePurchase( this.props.siteSlug, this.props.purchaseId ) }>
					{ titles.cancelPurchase }
				</HeaderCake>

				<Card className="cancel-purchase__card">
					<h2>{ heading }</h2>

					<CancelPurchaseRefundInformation
						purchase={ purchase }
						includedDomainPurchase={ this.props.includedDomainPurchase }
						confirmBundledDomain={ this.state.confirmCancelBundledDomain }
						cancelBundledDomain={ this.state.cancelBundledDomain }
						onCancelConfirmationStateChange={ this.onCancelConfirmationStateChange }
					/>
				</Card>

				<CompactCard className="cancel-purchase__product-information">
					<div className="cancel-purchase__purchase-name">{ purchaseName }</div>
					<div className="cancel-purchase__site-title">{ siteName || siteDomain }</div>
					<ProductLink purchase={ purchase } selectedSite={ this.props.site } />
				</CompactCard>
				<CompactCard className="cancel-purchase__footer">
					<div className="cancel-purchase__refund-amount">
						{ this.renderFooterText( this.props ) }
					</div>
					<CancelPurchaseButton
						purchase={ purchase }
						includedDomainPurchase={ this.props.includedDomainPurchase }
						disabled={ this.state.cancelBundledDomain && ! this.state.confirmCancelBundledDomain }
						selectedSite={ this.props.site }
						siteSlug={ this.props.siteSlug }
						cancelBundledDomain={ this.state.cancelBundledDomain }
					/>
				</CompactCard>
			</Main>
		);
	}
}

export default connect( ( state, props ) => {
	const purchase = getByPurchaseId( state, props.purchaseId );
	return {
		hasLoadedSites: ! isRequestingSites( state ),
		hasLoadedUserPurchasesFromServer: hasLoadedUserPurchasesFromServer( state ),
		purchase,
		includedDomainPurchase: getIncludedDomainPurchase( state, purchase ),
		site: getSite( state, purchase ? purchase.siteId : null ),
		userId: getCurrentUserId( state ),
	};
} )( localize( withLocalizedMoment( CancelPurchase ) ) );
