import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { AuditLogEvent, Guild, GuildAuditLogsEntry } from 'discord.js';

export type CustomGuildAuditLogEntryCreateEvents = {
	guildAuditLogEntryAdd: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];
	guildAuditLogEntryUpdate: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];
	guildAuditLogEntryDelete: [auditLogEntry: GuildAuditLogsEntry, guild: Guild];

	guildAuditLogEntryWebhookCreate: [
		auditLogEntry: GuildAuditLogsEntry<AuditLogEvent.WebhookCreate>,
		guild: Guild
	];
	guildAuditLogEntryWebhookUpdate: [
		auditLogEntry: GuildAuditLogsEntry<AuditLogEvent.WebhookUpdate>,
		guild: Guild
	];
	guildAuditLogEntryWebhookDelete: [
		auditLogEntry: GuildAuditLogsEntry<AuditLogEvent.WebhookDelete>,
		guild: Guild
	];
};

@Injectable()
@CustomListener('guildAuditLogEntryCreate')
export class GuildAuditLogEntryCreateHandler extends BaseHandler<CustomGuildAuditLogEntryCreateEvents> {
	@CustomListenerHandler()
	public handleGuildAuditLogEntryChanges(...args: ContextOf<'guildAuditLogEntryCreate'>) {
		const [auditLogEntry, guild] = args;

		const { actionType } = auditLogEntry;

		switch (actionType) {
			case 'Create':
				this.emit(
					this.extendEventContext('guildAuditLogEntryAdd', args),
					auditLogEntry,
					guild
				);
				break;
			case 'Update':
				this.emit(
					this.extendEventContext('guildAuditLogEntryUpdate', args),
					auditLogEntry,
					guild
				);
				break;
			case 'Delete':
				this.emit(
					this.extendEventContext('guildAuditLogEntryDelete', args),
					auditLogEntry,
					guild
				);
				break;
		}
	}

	@CustomListenerHandler()
	public handleGuildAuditLogEntryWebhookChanges(...args: ContextOf<'guildAuditLogEntryCreate'>) {
		const [auditLogEntry, guild] = args;

		const { actionType, targetType } = auditLogEntry;

		if (targetType !== 'Webhook') {
			return;
		}

		switch (actionType) {
			case 'Create':
				this.emit(
					this.extendEventContext('guildAuditLogEntryWebhookCreate', args),
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookCreate>,
					guild
				);
				break;
			case 'Update':
				this.emit(
					this.extendEventContext('guildAuditLogEntryWebhookUpdate', args),
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookUpdate>,
					guild
				);
				break;
			case 'Delete':
				this.emit(
					this.extendEventContext('guildAuditLogEntryWebhookDelete', args),
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookDelete>,
					guild
				);
				break;
		}
	}
}
