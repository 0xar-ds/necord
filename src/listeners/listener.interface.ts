import { ClientEvents } from 'discord.js';
import {
	CustomChannelUpdateEvents,
	CustomGuildAuditLogEntryCreateEvents,
	CustomGuildMemberUpdateEvents,
	CustomGuildUpdateEvents,
	CustomMessageUpdateEvents,
	CustomPresenceUpdateEvents,
	CustomRoleUpdateEvents,
	CustomThreadUpdateEvents,
	CustomUserUpdateEvents,
	CustomVoiceStateUpdateEvents
} from './handlers';

export type ClientEventUnion<T extends keyof ClientEvents = keyof ClientEvents> = {
	[Event in keyof ClientEvents]: {
		event: Event;
		payload: ClientEvents[Event];
	};
}[T];

export const BASE_CLIENT_EVENT = Symbol(this);

export interface ClientEventContext<T extends keyof ClientEvents = keyof ClientEvents> {
	[BASE_CLIENT_EVENT]: ClientEventUnion<T>;
}

export type NecordEvents = ClientEvents &
	CustomChannelUpdateEvents &
	CustomGuildAuditLogEntryCreateEvents &
	CustomGuildMemberUpdateEvents &
	CustomGuildUpdateEvents &
	CustomMessageUpdateEvents &
	CustomPresenceUpdateEvents &
	CustomRoleUpdateEvents &
	CustomThreadUpdateEvents &
	CustomUserUpdateEvents &
	CustomVoiceStateUpdateEvents;
