/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { applySiteOffset } from 'wp-calypso-client/lib/site/timezone';
import { backupMainPath } from 'wp-calypso-client/my-sites/backup/paths';
import { Card } from '@automattic/components';
import {
	isSuccessfulDailyBackup,
	isSuccessfulRealtimeBackup,
	INDEX_FORMAT,
} from 'wp-calypso-client/lib/jetpack/backup-utils';
import { withLocalizedMoment } from 'wp-calypso-client/components/localized-moment';
import ActivityCard from 'wp-calypso-client/components/activity-card';
import BackupChanges from './backup-changes';
import Button from 'wp-calypso-client/components/forms/form-button';
import ActionButtons from './action-buttons';

/**
 * Style dependencies
 */
import './style.scss';
import contactSupportUrl from 'wp-calypso-client/lib/jetpack/contact-support-url';
import cloudErrorIcon from './icons/cloud-error.svg';
import cloudWarningIcon from './icons/cloud-warning.svg';
import cloudSuccessIcon from './icons/cloud-success.svg';
import cloudScheduleIcon from './icons/cloud-schedule.svg';

class DailyBackupStatus extends Component {
	getValidRestoreId = () => {
		const { dailyBackup, hasRealtimeBackups, realtimeBackups } = this.props;
		const realtimeBackup = get( realtimeBackups, '[0]', [] );
		return hasRealtimeBackups ? realtimeBackup.rewindId : dailyBackup.rewindId;
	};

	getDisplayDate = ( date, withLatest = true ) => {
		const { translate, moment, timezone, gmtOffset } = this.props;

		//Apply the time offset
		const backupDate = applySiteOffset( moment( date ), { timezone, gmtOffset } );
		const today = applySiteOffset( moment(), { timezone, gmtOffset } );

		const isToday = today.isSame( backupDate, 'day' );
		const yearToday = today.format( 'YYYY' );
		const yearDate = backupDate.format( 'YYYY' );

		const dateFormat = yearToday === yearDate ? 'MMM D' : 'MMM D, YYYY';
		const displayBackupTime = backupDate.format( 'LT' );

		let displayableDate;

		if ( isToday && withLatest ) {
			displayableDate = translate( 'Latest: Today %s', {
				args: [ displayBackupTime ],
				comment: '%s is the time of the last backup from today',
			} );
		} else if ( isToday ) {
			displayableDate = translate( 'Today %s', {
				args: [ displayBackupTime ],
				comment: '%s is the time of the last backup from today',
			} );
		} else if ( withLatest ) {
			displayableDate = translate( 'Latest: %s', {
				args: [ backupDate.format( dateFormat + ', LT' ) ],
			} );
		} else {
			displayableDate = backupDate.format( dateFormat + ', LT' );
		}

		return displayableDate;
	};

	renderGoodBackup( backup ) {
		const {
			hasRealtimeBackups,
			deltas,
			selectedDate,
			// metaDiff,
			translate,
			moment,
			timezone,
			gmtOffset,
		} = this.props;
		const displayDate = this.getDisplayDate( backup.activityTs );
		const displayDateNoLatest = this.getDisplayDate( backup.activityTs, false );

		const today = applySiteOffset( moment(), {
			timezone: timezone,
			gmtOffset: gmtOffset,
		} );
		const isToday = selectedDate.isSame( today, 'day' );

		const meta = get( backup, 'activityDescription[2].children[0]', '' );

		// We should only showing the summarized ActivityCard for Real-time sites when the latest backup is not a full backup
		const showBackupDetails =
			hasRealtimeBackups &&
			( 'rewind__backup_complete_full' !== backup.activityName ||
				'rewind__backup_only_complete_full' !== backup.activityName );

		return (
			<>
				<div className="daily-backup-status__message-head">
					<img src={ cloudSuccessIcon } alt="" role="presentation" />
					<div className="daily-backup-status__hide-mobile">
						{ isToday ? translate( 'Latest backup' ) : translate( 'Latest backup on this day' ) }
					</div>
				</div>
				<div className="daily-backup-status__hide-desktop">
					<div className="daily-backup-status__title">{ displayDate }</div>
				</div>
				<div className="daily-backup-status__hide-mobile">
					<div className="daily-backup-status__title">{ displayDateNoLatest }</div>
				</div>
				<div className="daily-backup-status__meta">{ meta }</div>
				<ActionButtons rewindId={ backup.rewindId } />
				{ showBackupDetails && this.renderBackupDetails( backup ) }
				{ /*{ ! hasRealtimeBackups && <BackupChanges { ...{ deltas, metaDiff } } /> }*/ }
				{ ! hasRealtimeBackups && <BackupChanges { ...{ deltas } } /> }
			</>
		);
	}

	renderFailedBackup( backup ) {
		const { translate, timezone, gmtOffset, siteUrl } = this.props;

		const backupDate = applySiteOffset( backup.activityTs, { timezone, gmtOffset } );

		const displayDate = backupDate.format( 'L' );
		const displayTime = backupDate.format( 'LT' );

		return (
			<>
				<div className="daily-backup-status__message-head">
					<img src={ cloudErrorIcon } alt="" role="presentation" />
					<div className="daily-backup-status__message-error">{ translate( 'Backup failed' ) }</div>
				</div>
				<div className="daily-backup-status__title">
					{ this.getDisplayDate( backup.activityTs, false ) }
				</div>
				<div className="daily-backup-status__label">
					<p>
						{ translate(
							'A backup for your site was attempted on %(displayDate)s at %(displayTime)s and was not ' +
								'able to be completed.',
							{ args: { displayDate, displayTime } }
						) }
					</p>
					<p>
						{ translate(
							'Check out the {{a}}backups help guide{{/a}} or contact our support team to resolve the ' +
								'issue.',
							{
								components: {
									a: (
										<a
											href="https://jetpack.com/support/backup/"
											target="_blank"
											rel="noopener noreferrer"
										/>
									),
								},
							}
						) }
					</p>
					<Button
						className="daily-backup-status__support-button"
						href={ contactSupportUrl( siteUrl ) }
						target="_blank"
						rel="noopener noreferrer"
						isPrimary={ false }
					>
						{ translate( 'Contact support' ) }
					</Button>
				</div>
			</>
		);
	}

	renderNoBackupEver() {
		const { translate, siteUrl } = this.props;

		return (
			<>
				<div className="daily-backup-status__message-head">
					<img src={ cloudWarningIcon } alt="" role="presentation" />
					<div>{ translate( 'No backups are available yet' ) }</div>
				</div>
				<div className="daily-backup-status__label">
					{ translate(
						'But don’t worry, one should become available in the next 24 hours. Contact support if you still need help.'
					) }
				</div>

				<Button
					className="daily-backup-status__support-button"
					href={ contactSupportUrl( siteUrl ) }
					target="_blank"
					rel="noopener noreferrer"
					isPrimary={ false }
				>
					{ translate( 'Contact support' ) }
				</Button>
			</>
		);
	}

	renderNoBackupOnDate() {
		const { translate, selectedDate, siteSlug, siteUrl } = this.props;

		const displayDate = selectedDate.format( 'll' );
		const nextDate = selectedDate.clone().add( 1, 'days' );
		const displayNextDate = nextDate.format( 'll' );

		return (
			<>
				<div className="daily-backup-status__message-head">
					<img
						className="daily-backup-status__warning-color"
						src={ cloudWarningIcon }
						alt=""
						role="presentation"
					/>
					<div className="daily-backup-status__title">{ translate( 'No backup' ) }</div>
				</div>

				<div className="daily-backup-status__label">
					<p>
						{ translate( 'The backup attempt for %(displayDate)s was delayed.', {
							args: { displayDate },
						} ) }
					</p>
					<p>
						{ translate(
							'But don’t worry, it was likely completed in the early hours the next morning. ' +
								'Check the following day, {{link}}%(displayNextDate)s{{/link}} or contact support if you still need help.',
							{
								args: { displayNextDate },
								components: {
									link: (
										<a
											href={ backupMainPath( siteSlug, {
												date: nextDate.format( INDEX_FORMAT ),
											} ) }
										/>
									),
								},
							}
						) }
					</p>
				</div>

				<Button
					className="daily-backup-status__support-button"
					href={ contactSupportUrl( siteUrl ) }
					target="_blank"
					rel="noopener noreferrer"
					isPrimary={ false }
				>
					{ translate( 'Contact support' ) }
				</Button>
			</>
		);
	}

	renderNoBackupToday( lastBackupDate ) {
		const { translate, timezone, gmtOffset, moment, siteSlug } = this.props;

		const today = applySiteOffset( moment(), {
			timezone: timezone,
			gmtOffset: gmtOffset,
		} );
		const yesterday = moment( today ).subtract( 1, 'days' );

		const lastBackupDay = lastBackupDate.isSame( yesterday, 'day' )
			? translate( 'Yesterday ' )
			: lastBackupDate.format( 'll' );

		const lastBackupTime = lastBackupDate.format( 'LT' );

		// Calculates the remaining hours for the next backup + 3 hours of safety margin
		const DAY_HOURS = 24;
		const hoursForNextBackup = DAY_HOURS - today.diff( lastBackupDate, 'hours' ) + 3;

		const nextBackupHoursText =
			hoursForNextBackup <= 1
				? translate( 'In the next hour' )
				: translate( 'In the next %d hour', 'In the next %d hours', {
						args: [ hoursForNextBackup ],
						count: hoursForNextBackup,
				  } );

		return (
			<>
				<div className="daily-backup-status__message-head">
					<img src={ cloudScheduleIcon } alt="" role="presentation" />
					<div className="daily-backup-status__hide-mobile">
						{ translate( 'Backup Scheduled' ) }
					</div>
				</div>
				<div className="daily-backup-status__title">
					<div className="daily-backup-status__hide-desktop">
						{ translate( 'Backup Scheduled' ) }:
					</div>
					<div>{ nextBackupHoursText }</div>
				</div>
				<div className="daily-backup-status__no-backup-last-backup">
					{ translate( 'Last daily backup: {{link}}%(lastBackupDay)s %(lastBackupTime)s{{/link}}', {
						args: { lastBackupDay, lastBackupTime },
						components: {
							link: (
								<a
									href={ backupMainPath( siteSlug, {
										date: lastBackupDate.format( INDEX_FORMAT ),
									} ) }
								/>
							),
						},
					} ) }
				</div>
				<ActionButtons disabled />
			</>
		);
	}

	renderBackupDetails( backup ) {
		return (
			<div className="daily-backup-status__realtime-details">
				<div className="daily-backup-status__realtime-details-card">
					<ActivityCard activity={ backup } summarize />
				</div>
			</div>
		);
	}

	renderBackupStatus( backup ) {
		const {
			hasRealtimeBackups,
			selectedDate,
			lastDateAvailable,
			moment,
			timezone,
			gmtOffset,
		} = this.props;

		if ( backup && hasRealtimeBackups ) {
			return isSuccessfulRealtimeBackup( backup )
				? this.renderGoodBackup( backup )
				: this.renderFailedBackup( backup );
		} else if ( backup && ! hasRealtimeBackups ) {
			return isSuccessfulDailyBackup( backup )
				? this.renderGoodBackup( backup )
				: this.renderFailedBackup( backup );
		}

		if ( ! lastDateAvailable ) {
			return this.renderNoBackupEver();
		}

		const today = applySiteOffset( moment(), {
			timezone: timezone,
			gmtOffset: gmtOffset,
		} );

		const isToday = selectedDate.isSame( today, 'day' );
		if ( isToday ) {
			return this.renderNoBackupToday( lastDateAvailable );
		}

		return this.renderNoBackupOnDate();
	}

	render() {
		const { backup } = this.props;

		return (
			<div className="daily-backup-status">
				<Card className="daily-backup-status__success">{ this.renderBackupStatus( backup ) }</Card>
			</div>
		);
	}
}

export default localize( withLocalizedMoment( DailyBackupStatus ) );
