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
				this.emit('guildAuditLogEntryAdd', args, auditLogEntry, guild);
				break;
			case 'Update':
				this.emit('guildAuditLogEntryUpdate', args, auditLogEntry, guild);
				break;
			case 'Delete':
				this.emit('guildAuditLogEntryDelete', args, auditLogEntry, guild);
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
					'guildAuditLogEntryWebhookCreate',
					args,
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookCreate>,
					guild
				);
				break;
			case 'Update':
				this.emit(
					'guildAuditLogEntryWebhookUpdate',
					args,
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookUpdate>,
					guild
				);
				break;
			case 'Delete':
				this.emit(
					'guildAuditLogEntryWebhookDelete',
					args,
					auditLogEntry as GuildAuditLogsEntry<AuditLogEvent.WebhookDelete>,
					guild
				);
				break;
		}
	}
}
