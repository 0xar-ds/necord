import { Client, ClientEvents } from 'discord.js';
import { Inject } from '@nestjs/common';
import {
	BASE_CLIENT_EVENT,
	ClientEventContext,
	ClientEventUnion,
	NecordEvents
} from '../listener.interface';

type OnlyCustomEvents = Exclude<NecordEvents, ClientEvents>;

export abstract class BaseHandler<Events extends Record<string, Array<any>> = OnlyCustomEvents> {
	@Inject(Client)
	private readonly client: Client;

	protected extendEventContext<K extends keyof Events>(
		event: K,
		source: ClientEventUnion['payload']
	): { event: K } & ClientEventContext {
		return {
			event: event,
			[BASE_CLIENT_EVENT]: source[BASE_CLIENT_EVENT]
		};
	}

	protected emit<K extends keyof Events>(
		event: { event: K } & ClientEventContext,
		...args: Events[K]
	): void;
	protected emit<K extends keyof Events>(event: K, ...args: Events[K]): void;
	protected emit<K extends keyof Events>(
		event: K | ({ event: K } & ClientEventContext),
		...args: Events[K]
	): void {
		if ('object' === typeof event) {
			Object.defineProperty(args, BASE_CLIENT_EVENT, {
				value: event[BASE_CLIENT_EVENT],
				enumerable: false
			});

			return void this.client.emit<any>(event.event, ...args);
		}

		return void this.client.emit<any>(event, ...args);
	}
}
