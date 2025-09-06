import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { User, UserFlagsBitField } from 'discord.js';

export type CustomUserUpdateEvents = {
	userAvatarUpdate: [user: User, oldAvatar: string, newAvatar: string];
	userUsernameUpdate: [user: User, oldUsername: string, newUsername: string];
	userDiscriminatorUpdate: [user: User, oldDiscriminator: string, newDiscriminator: string];
	userFlagsUpdate: [
		user: User,
		oldFlags: Readonly<UserFlagsBitField>,
		newFlags: Readonly<UserFlagsBitField>
	];
};

@Injectable()
@CustomListener('userUpdate')
export class UserUpdateHandler extends BaseHandler<CustomUserUpdateEvents> {
	@CustomListenerHandler()
	public handleUserAvatarUpdate(...args: ContextOf<'userUpdate'>) {
		const [oldUser, newUser] = args;

		if (oldUser.partial) return;

		if (oldUser.displayAvatarURL() !== newUser.displayAvatarURL()) {
			this.emit(
				'userAvatarUpdate',
				args,
				newUser,
				oldUser.displayAvatarURL(),
				newUser.displayAvatarURL()
			);
		}
	}

	@CustomListenerHandler()
	public handleUserUsernameUpdate(...args: ContextOf<'userUpdate'>) {
		const [oldUser, newUser] = args;

		if (oldUser.partial) return;

		if (oldUser.username !== newUser.username) {
			this.emit('userUsernameUpdate', args, newUser, oldUser.username, newUser.username);
		}
	}

	@CustomListenerHandler()
	public handleUserDiscriminatorUpdate(...args: ContextOf<'userUpdate'>) {
		const [oldUser, newUser] = args;

		if (oldUser.partial) return;

		if (oldUser.discriminator !== newUser.discriminator) {
			this.emit(
				'userDiscriminatorUpdate',
				args,
				newUser,
				oldUser.discriminator,
				newUser.discriminator
			);
		}
	}

	@CustomListenerHandler()
	public handleUserFlagsUpdate(...args: ContextOf<'userUpdate'>) {
		const [oldUser, newUser] = args;

		if (oldUser.partial) return;

		if (oldUser.flags !== newUser.flags) {
			this.emit('userFlagsUpdate', args, newUser, oldUser.flags, newUser.flags);
		}
	}
}
