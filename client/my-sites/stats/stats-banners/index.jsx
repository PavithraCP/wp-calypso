/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { abtest } from 'wp-calypso-client/lib/abtest';
import { isEcommercePlan } from 'wp-calypso-client/lib/plans';
import config from 'wp-calypso-client/config';
import ECommerceManageNudge from 'wp-calypso-client/blocks/ecommerce-manage-nudge';
import { getDomainsBySiteId } from 'wp-calypso-client/state/sites/domains/selectors';
import { getSitePlanSlug } from 'wp-calypso-client/state/sites/selectors';
import GoogleMyBusinessStatsNudge from 'wp-calypso-client/blocks/google-my-business-stats-nudge';
import isGoogleMyBusinessStatsNudgeVisibleSelector from 'wp-calypso-client/state/selectors/is-google-my-business-stats-nudge-visible';
import isUpworkStatsNudgeDismissed from 'wp-calypso-client/state/selectors/is-upwork-stats-nudge-dismissed';
import QuerySiteDomains from 'wp-calypso-client/components/data/query-site-domains';
import UpworkStatsNudge from 'wp-calypso-client/blocks/upwork-stats-nudge';

class StatsBanners extends Component {
	static propTypes = {
		domains: PropTypes.array.isRequired,
		isGoogleMyBusinessStatsNudgeVisible: PropTypes.bool.isRequired,
		isUpworkStatsNudgeVisible: PropTypes.bool.isRequired,
		planSlug: PropTypes.string.isRequired,
		siteId: PropTypes.number.isRequired,
		slug: PropTypes.string.isRequired,
	};

	shouldComponentUpdate( nextProps ) {
		return (
			this.props.isUpworkStatsNudgeVisible !== nextProps.isUpworkStatsNudgeVisible ||
			this.props.isGoogleMyBusinessStatsNudgeVisible !==
				nextProps.isGoogleMyBusinessStatsNudgeVisible ||
			this.props.domains.length !== nextProps.domains.length
		);
	}

	renderBanner() {
		if ( this.showUpworkBanner() ) {
			return this.renderUpworkBanner();
		} else if ( this.showGoogleMyBusinessBanner() ) {
			return this.renderGoogleMyBusinessBanner();
		}
	}

	renderGoogleMyBusinessBanner() {
		const { isGoogleMyBusinessStatsNudgeVisible, siteId, slug, primaryButton } = this.props;

		return (
			<GoogleMyBusinessStatsNudge
				siteSlug={ slug }
				siteId={ siteId }
				visible={ isGoogleMyBusinessStatsNudgeVisible }
				primaryButton={ primaryButton }
			/>
		);
	}

	renderUpworkBanner() {
		const { siteId, slug, primaryButton } = this.props;

		return <UpworkStatsNudge siteSlug={ slug } siteId={ siteId } primaryButton={ primaryButton } />;
	}

	showGoogleMyBusinessBanner() {
		return (
			config.isEnabled( 'google-my-business' ) && this.props.isGoogleMyBusinessStatsNudgeVisible
		);
	}

	showUpworkBanner() {
		return (
			abtest( 'builderReferralStatsNudge' ) === 'builderReferralBanner' &&
			this.props.isUpworkStatsNudgeVisible
		);
	}

	render() {
		const { planSlug, siteId, domains } = this.props;

		if ( isEmpty( domains ) ) {
			return null;
		}

		return (
			<Fragment>
				{ siteId && <QuerySiteDomains siteId={ siteId } /> }

				{ isEcommercePlan( planSlug ) && <ECommerceManageNudge siteId={ siteId } /> }

				{ this.renderBanner() }
			</Fragment>
		);
	}
}

export default connect( ( state, ownProps ) => {
	const domains = getDomainsBySiteId( state, ownProps.siteId );

	return {
		domains,
		isGoogleMyBusinessStatsNudgeVisible: isGoogleMyBusinessStatsNudgeVisibleSelector(
			state,
			ownProps.siteId
		),
		isUpworkStatsNudgeVisible: ! isUpworkStatsNudgeDismissed( state, ownProps.siteId ),
		planSlug: getSitePlanSlug( state, ownProps.siteId ),
	};
} )( localize( StatsBanners ) );
