import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import {
	DMChannel,
	GuildChannel,
	NonThreadGuildBasedChannel,
	PermissionOverwriteManager
} from 'discord.js';

export type CustomChannelUpdateEvents = {
	guildChannelPermissionsUpdate: [
		channel: DMChannel | NonThreadGuildBasedChannel,
		oldPermissions: PermissionOverwriteManager,
		newPermissions: PermissionOverwriteManager
	];
};

@Injectable()
@CustomListener('channelUpdate')
export class ChannelUpdateHandler extends BaseHandler<CustomChannelUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildChannelPermissionsUpdate(...args: ContextOf<'channelUpdate'>) {
		const [oldChannel, newChannel] = args;

		if (
			(oldChannel as GuildChannel).permissionOverwrites !==
			(newChannel as GuildChannel).permissionOverwrites
		) {
			this.emit(
				'guildChannelPermissionsUpdate',
				args,
				newChannel,
				(oldChannel as GuildChannel).permissionOverwrites,
				(newChannel as GuildChannel).permissionOverwrites
			);
		}
	}
}
