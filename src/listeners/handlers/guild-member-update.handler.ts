import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { GuildMember, Role } from 'discord.js';

export type CustomGuildMemberUpdateEvents = {
	guildMemberBoost: [member: GuildMember];
	guildMemberUnboost: [member: GuildMember];
	guildMemberRoleAdd: [member: GuildMember, role: Role];
	guildMemberRoleRemove: [member: GuildMember, role: Role];
	guildMemberNicknameUpdate: [member: GuildMember, oldNickname: string, newNickname: string];
	guildMemberEntered: [member: GuildMember];
	guildMemberAvatarAdd: [member: GuildMember, avatarURL: string];
	guildMemberAvatarUpdate: [member: GuildMember, oldAvatarURL: string, newAvatarURL: string];
	guildMemberAvatarRemove: [member: GuildMember, oldAvatarURL: string];
};

@Injectable()
@CustomListener('guildMemberUpdate')
export class GuildMemberUpdateHandler extends BaseHandler<CustomGuildMemberUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildMemberAvatar(...args: ContextOf<'guildMemberUpdate'>) {
		const [oldMember, newMember] = args;

		if (oldMember.partial) return;

		if (!oldMember.avatar && newMember.avatar) {
			this.emit(
				this.extendEventContext('guildMemberAvatarAdd', args),
				newMember,
				newMember.avatarURL()
			);
		}

		if (oldMember.avatar !== newMember.avatar) {
			this.emit(
				this.extendEventContext('guildMemberAvatarUpdate', args),
				newMember,
				oldMember.avatarURL(),
				newMember.avatarURL()
			);
		}

		if (oldMember.avatar && !newMember.avatar) {
			this.emit(
				this.extendEventContext('guildMemberAvatarRemove', args),
				newMember,
				oldMember.avatarURL()
			);
		}
	}

	@CustomListenerHandler()
	public handleGuildMemberRoles(...args: ContextOf<'guildMemberUpdate'>) {
		const [oldMember, newMember] = args;

		if (oldMember.partial) return;

		const addedRoles: Role[] = newMember.roles.cache.reduce(
			(acc, role) => (!oldMember.roles.cache.has(role.id) ? acc.push(role) && acc : acc),
			[]
		);

		addedRoles.forEach(role => {
			this.emit(this.extendEventContext('guildMemberRoleAdd', args), newMember, role);
		});

		const removedRoles: Role[] = oldMember.roles.cache.reduce(
			(acc, role) => (!newMember.roles.cache.has(role.id) ? acc.push(role) && acc : acc),
			[]
		);

		removedRoles.forEach(role => {
			this.emit(this.extendEventContext('guildMemberRoleRemove', args), newMember, role);
		});
	}

	@CustomListenerHandler()
	public handleGuildMemberBoosting(...args: ContextOf<'guildMemberUpdate'>) {
		const [oldMember, newMember] = args;

		if (oldMember.partial) return;

		if (!oldMember.premiumSince && newMember.premiumSince) {
			this.emit(this.extendEventContext('guildMemberBoost', args), newMember);
		}

		if (oldMember.premiumSince && !newMember.premiumSince) {
			this.emit(this.extendEventContext('guildMemberUnboost', args), newMember);
		}
	}

	@CustomListenerHandler()
	public handleGuildMemberNicknameUpdate(...args: ContextOf<'guildMemberUpdate'>) {
		const [oldMember, newMember] = args;

		if (oldMember.partial) return;

		if (oldMember.nickname !== newMember.nickname) {
			this.emit(
				this.extendEventContext('guildMemberNicknameUpdate', args),
				newMember,
				oldMember.nickname,
				newMember.nickname
			);
		}
	}

	@CustomListenerHandler()
	public handleGuildMemberEntered(...args: ContextOf<'guildMemberUpdate'>) {
		const [oldMember, newMember] = args;

		if (oldMember.partial) return;

		if (oldMember.pending !== newMember.pending) {
			this.emit(this.extendEventContext('guildMemberEntered', args), newMember);
		}
	}
}
