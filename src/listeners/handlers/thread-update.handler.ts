import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { BaseHandler } from './base.handler';
import { ContextOf } from '../../context';
import { ThreadChannel } from 'discord.js';

export type CustomThreadUpdateEvents = {
	threadStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadNameUpdate: [thread: ThreadChannel, oldName: string, newName: string];
	threadLockStateUpdate: [oldThread: ThreadChannel, newThread: ThreadChannel];
	threadRateLimitPerUserUpdate: [
		thread: ThreadChannel,
		oldRateLimit: number,
		newRateLimit: number
	];
	threadAutoArchiveDurationUpdate: [
		thread: ThreadChannel,
		oldDuration: number | string,
		newDuration: number | string
	];
};

@Injectable()
@CustomListener('threadUpdate')
export class ThreadUpdateHandler extends BaseHandler<CustomThreadUpdateEvents> {
	@CustomListenerHandler()
	public handleThreadStateUpdate(...args: ContextOf<'threadUpdate'>) {
		const [oldThread, newThread] = args;

		if (oldThread.archived !== newThread.archived) {
			this.emit('threadStateUpdate', args, oldThread, newThread);
		}
	}

	@CustomListenerHandler()
	public handleThreadNameUpdate(...args: ContextOf<'threadUpdate'>) {
		const [oldThread, newThread] = args;

		if (oldThread.name !== newThread.name) {
			this.emit('threadNameUpdate', args, newThread, oldThread.name, newThread.name);
		}
	}

	@CustomListenerHandler()
	public handleThreadLockUpdate(...args: ContextOf<'threadUpdate'>) {
		const [oldThread, newThread] = args;

		if (oldThread.locked !== newThread.locked) {
			this.emit('threadLockStateUpdate', args, oldThread, newThread);
		}
	}

	@CustomListenerHandler()
	public handleThreadRateLimitPerUserUpdate(...args: ContextOf<'threadUpdate'>) {
		const [oldThread, newThread] = args;

		if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
			this.emit(
				'threadRateLimitPerUserUpdate',
				args,
				newThread,
				oldThread.rateLimitPerUser,
				newThread.rateLimitPerUser
			);
		}
	}

	@CustomListenerHandler()
	public handleThreadAutoArchiveDurationUpdate(...args: ContextOf<'threadUpdate'>) {
		const [oldThread, newThread] = args;

		if (oldThread.autoArchiveDuration !== newThread.autoArchiveDuration) {
			this.emit(
				'threadAutoArchiveDurationUpdate',
				args,
				newThread,
				oldThread.autoArchiveDuration,
				newThread.autoArchiveDuration
			);
		}
	}
}
