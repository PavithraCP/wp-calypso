/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { find, get, omit } from 'lodash';
import page from 'page';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import { Card } from '@automattic/components';
import SiteSelector from 'wp-calypso-client/components/site-selector';
import { getCurrentUser, currentUserHasFlag } from 'wp-calypso-client/state/current-user/selectors';
import { DOMAINS_WITH_PLANS_ONLY } from 'wp-calypso-client/state/current-user/constants';
import getSites from 'wp-calypso-client/state/selectors/get-sites';
import isDomainOnlySite from 'wp-calypso-client/state/selectors/is-domain-only-site';
import Header from 'wp-calypso-client/my-sites/domains/domain-management/components/header';
import Main from 'wp-calypso-client/components/main';
import {
	domainManagementList,
	domainManagementTransfer,
} from 'wp-calypso-client/my-sites/domains/paths';
import { getSelectedDomain } from 'wp-calypso-client/lib/domains';
import NonOwnerCard from 'wp-calypso-client/my-sites/domains/domain-management/components/domain/non-owner-card';
import DomainMainPlaceholder from 'wp-calypso-client/my-sites/domains/domain-management/components/domain/main-placeholder';
import TransferConfirmationDialog from './confirmation-dialog';
import { successNotice, errorNotice } from 'wp-calypso-client/state/notices/actions';
import wp from 'wp-calypso-client/lib/wp';
import { isWpComFreePlan } from 'wp-calypso-client/lib/plans';
import { requestSites } from 'wp-calypso-client/state/sites/actions';
import getCurrentRoute from 'wp-calypso-client/state/selectors/get-current-route';

const wpcom = wp.undocumented();

export class TransferToOtherSite extends React.Component {
	static propTypes = {
		currentUser: PropTypes.object.isRequired,
		isDomainOnly: PropTypes.bool.isRequired,
		isRequestingSiteDomains: PropTypes.bool.isRequired,
		selectedDomainName: PropTypes.string.isRequired,
		selectedSite: PropTypes.object.isRequired,
	};

	state = {
		targetSiteId: null,
		showConfirmationDialog: false,
		disableDialogButtons: false,
	};

	isDataReady() {
		return ! this.props.isRequestingSiteDomains;
	}

	isSiteEligible = ( site ) => {
		// check if it's an Atomic site from the site options
		const isAtomic = get( site, 'options.is_automated_transfer', false );

		return (
			site.capabilities.manage_options &&
			! ( site.jetpack && ! isAtomic ) && // Simple and Atomic sites. Not Jetpack sites.
			! get( site, 'options.is_domain_only', false ) &&
			! (
				this.props.domainsWithPlansOnly && isWpComFreePlan( get( site, 'plan.product_slug' ) )
			) &&
			site.ID !== this.props.selectedSite.ID
		);
	};

	handleSiteSelect = ( targetSiteId ) => {
		this.setState( {
			targetSiteId,
			showConfirmationDialog: true,
		} );
	};

	handleConfirmTransfer = ( targetSite, closeDialog ) => {
		const { selectedDomainName } = this.props;
		const targetSiteTitle = targetSite.title;
		const successMessage = this.props.translate(
			'%(selectedDomainName)s has been transferred to site: %(targetSiteTitle)s',
			{ args: { selectedDomainName, targetSiteTitle } }
		);
		const defaultErrorMessage = this.props.translate(
			'Failed to transfer %(selectedDomainName)s, please try again or contact support.',
			{
				args: { selectedDomainName },
			}
		);

		this.setState( { disableDialogButtons: true } );
		wpcom
			.transferToSite( this.props.selectedSite.ID, this.props.selectedDomainName, targetSite.ID )
			.then(
				() => {
					this.props.successNotice( successMessage, { duration: 10000, isPersistent: true } );
					if ( this.props.isDomainOnly ) {
						this.props.requestSites();
						const transferedTo = find( this.props.sites, { ID: targetSite.ID } );
						page( domainManagementList( transferedTo.slug ) );
					} else {
						page( domainManagementList( this.props.selectedSite.slug ) );
					}
				},
				( error ) => {
					this.setState( { disableDialogButtons: false } );
					closeDialog();
					this.props.errorNotice( error.message || defaultErrorMessage );
				}
			);
	};

	handleDialogClose = () => {
		if ( ! this.state.disableDialogButtons ) {
			this.setState( { showConfirmationDialog: false } );
		}
	};

	render() {
		if ( ! this.isDataReady() ) {
			return <DomainMainPlaceholder goBack={ this.goToEdit } />;
		}

		const { selectedSite, selectedDomainName, currentRoute } = this.props;
		const { slug } = selectedSite;

		return (
			<Main className="transfer-to-other-site">
				<Header
					selectedDomainName={ selectedDomainName }
					backHref={ domainManagementTransfer( slug, selectedDomainName, currentRoute ) }
				>
					{ this.props.translate( 'Transfer Domain To Another Site' ) }
				</Header>
				{ this.renderSection() }
			</Main>
		);
	}

	renderSection() {
		const { currentUserCanManage } = getSelectedDomain( this.props );
		if ( ! currentUserCanManage ) {
			return <NonOwnerCard { ...omit( this.props, [ 'children' ] ) } />;
		}

		const { selectedDomainName: domainName, domainsWithPlansOnly, translate } = this.props;
		let message;
		if ( domainsWithPlansOnly ) {
			message = translate(
				'Please choose a site with a paid plan ' +
					"you're an administrator on to transfer {{strong}}%(domainName)s{{/strong}} to:",
				{ args: { domainName }, components: { strong: <strong /> } }
			);
		} else {
			message = translate(
				"Please choose a site you're an administrator on to transfer {{strong}}%(domainName)s{{/strong}} to:",
				{ args: { domainName }, components: { strong: <strong /> } }
			);
		}

		return (
			<div>
				<Card className="transfer-to-other-site__card">
					<p>{ message }</p>
					<SiteSelector
						filter={ this.isSiteEligible }
						sites={ this.props.sites }
						onSiteSelect={ this.handleSiteSelect }
					/>
				</Card>
				{ this.state.targetSiteId && (
					<TransferConfirmationDialog
						targetSiteId={ this.state.targetSiteId }
						domainName={ this.props.selectedDomainName }
						onConfirmTransfer={ this.handleConfirmTransfer }
						onClose={ this.handleDialogClose }
						isVisible={ this.state.showConfirmationDialog }
						disableDialogButtons={ this.state.disableDialogButtons }
					/>
				) }
			</div>
		);
	}
}

export default connect(
	( state, ownProps ) => ( {
		currentUser: getCurrentUser( state ),
		domainsWithPlansOnly: currentUserHasFlag( state, DOMAINS_WITH_PLANS_ONLY ),
		isDomainOnly: isDomainOnlySite( state, get( ownProps, 'selectedSite.ID', null ) ),
		sites: getSites( state ),
		currentRoute: getCurrentRoute( state ),
	} ),
	{
		errorNotice,
		requestSites,
		successNotice,
	}
)( localize( TransferToOtherSite ) );
