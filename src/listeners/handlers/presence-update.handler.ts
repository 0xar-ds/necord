import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { GuildMember, PresenceStatus } from 'discord.js';

export type CustomPresenceUpdateEvents = {
	guildMemberOffline: [member: GuildMember, oldStatus: PresenceStatus];
	guildMemberOnline: [member: GuildMember, newStatus: PresenceStatus];
};

@Injectable()
@CustomListener('presenceUpdate')
export class PresenceUpdateHandler extends BaseHandler<CustomPresenceUpdateEvents> {
	@CustomListenerHandler()
	public handlePresenceUpdate(...args: ContextOf<'presenceUpdate'>) {
		const [oldPresence, newPresence] = args;

		if (!oldPresence) return;

		if (oldPresence.status !== 'offline' && newPresence.status === 'offline') {
			this.emit(
				this.extendEventContext('guildMemberOffline', args),
				newPresence.member,
				oldPresence.status
			);
		}

		if (oldPresence.status === 'offline' && newPresence.status !== 'offline') {
			this.emit(
				this.extendEventContext('guildMemberOnline', args),
				newPresence.member,
				newPresence.status
			);
		}
	}
}
