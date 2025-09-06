import { Client, ClientEvents } from 'discord.js';
import { Inject } from '@nestjs/common';
import { BASE_CLIENT_EVENT, ClientEventContext, NecordEvents } from '../listener.interface';
import { ContextOf } from '../../context';

type OnlyCustomEvents = Exclude<NecordEvents, ClientEvents>;

export abstract class BaseHandler<Events extends Record<string, Array<any>> = OnlyCustomEvents> {
	@Inject(Client)
	private readonly client: Client;

	protected emit<K extends keyof Events>(
		event: K,
		context: ContextOf<keyof ClientEvents>,
		...args: Events[K]
	) {
		Object.defineProperty(args, BASE_CLIENT_EVENT, {
			value: context[BASE_CLIENT_EVENT],
			enumerable: false
		});

		this.client.emit<any>(event, ...args);
	}
}
