import { BaseHandler } from './base.handler';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { Injectable } from '@nestjs/common';
import { ContextOf } from '../../context';
import { Message, PartialMessage } from 'discord.js';

export type CustomMessageUpdateEvents = {
	messagePinned: [Message | PartialMessage];
	messageContentEdited: [
		message: Message | PartialMessage,
		oldContent: string,
		newContent: string
	];
};

@Injectable()
@CustomListener('messageUpdate')
export class MessageUpdateHandler extends BaseHandler<CustomMessageUpdateEvents> {
	@CustomListenerHandler()
	public handleMessagePinned(...args: ContextOf<'messageUpdate'>) {
		const [oldMessage, newMessage] = args;

		if (oldMessage.partial || newMessage.partial) return;

		if (!oldMessage.pinned && newMessage.pinned) {
			this.emit(this.extendEventContext('messagePinned', args), newMessage);
		}
	}

	@CustomListenerHandler()
	public handleMessageContentEdited(...args: ContextOf<'messageUpdate'>) {
		const [oldMessage, newMessage] = args;

		if (oldMessage.partial || newMessage.partial) return;

		if (oldMessage.content !== newMessage.content) {
			this.emit(
				this.extendEventContext('messageContentEdited', args),
				newMessage,
				oldMessage.content,
				newMessage.content
			);
		}
	}
}
