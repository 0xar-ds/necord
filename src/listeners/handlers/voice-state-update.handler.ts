import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { GuildMember, VoiceBasedChannel } from 'discord.js';

export type CustomVoiceStateUpdateEvents = {
	voiceChannelJoin: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelSwitch: [
		member: GuildMember,
		oldChannel: VoiceBasedChannel,
		newChannel: VoiceBasedChannel
	];
	voiceChannelLeave: [member: GuildMember, channel: VoiceBasedChannel];
	voiceChannelMute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelUnmute: [member: GuildMember, type: 'self-muted' | 'server-muted'];
	voiceChannelDeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceChannelUndeaf: [member: GuildMember, type: 'self-deafed' | 'server-deafed'];
	voiceStreamingStart: [member: GuildMember, channel: VoiceBasedChannel];
	voiceStreamingStop: [member: GuildMember, channel: VoiceBasedChannel];
};

@Injectable()
@CustomListener('voiceStateUpdate')
export class VoiceStateUpdateHandler extends BaseHandler<CustomVoiceStateUpdateEvents> {
	@CustomListenerHandler()
	public handleVoiceChannelChanges(...args: ContextOf<'voiceStateUpdate'>) {
		const [oldState, newState] = args;

		const newMember = newState.member;

		if (!oldState.channel && newState.channel) {
			this.emit(
				this.extendEventContext('voiceChannelJoin', args),
				newMember,
				newState.channel
			);
		}

		if (oldState.channel && newState.channel && oldState.channel.id !== newState.channel.id) {
			this.emit(
				this.extendEventContext('voiceChannelSwitch', args),
				newMember,
				oldState.channel,
				newState.channel
			);
		}

		if (oldState.channel && !newState.channel) {
			this.emit(
				this.extendEventContext('voiceChannelLeave', args),
				newMember,
				oldState.channel
			);
		}
	}

	@CustomListenerHandler()
	public handleVoiceChannelMuteChanges(...args: ContextOf<'voiceStateUpdate'>) {
		const [oldState, newState] = args;

		const newMember = newState.member;

		if (!oldState.mute && newState.mute) {
			this.emit(
				this.extendEventContext('voiceChannelMute', args),
				newMember,
				newState.selfMute ? 'self-muted' : 'server-muted'
			);
		}

		if (oldState.mute && !newState.mute) {
			this.emit(
				this.extendEventContext('voiceChannelUnmute', args),
				newMember,
				oldState.selfMute ? 'self-muted' : 'server-muted'
			);
		}
	}

	@CustomListenerHandler()
	public handleVoiceChannelDeafChanges(...args: ContextOf<'voiceStateUpdate'>) {
		const [oldState, newState] = args;

		const newMember = newState.member;

		if (!oldState.deaf && newState.deaf) {
			this.emit(
				this.extendEventContext('voiceChannelDeaf', args),
				newMember,
				newState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}

		if (oldState.deaf && !newState.deaf) {
			this.emit(
				this.extendEventContext('voiceChannelUndeaf', args),
				newMember,
				oldState.selfDeaf ? 'self-deafed' : 'server-deafed'
			);
		}
	}

	@CustomListenerHandler()
	public handleVoiceStreamingChanges(...args: ContextOf<'voiceStateUpdate'>) {
		const [oldState, newState] = args;

		const newMember = newState.member;

		if (!oldState.streaming && newState.streaming) {
			this.emit(
				this.extendEventContext('voiceStreamingStart', args),
				newMember,
				newState.channel
			);
		}

		if (oldState.streaming && !newState.streaming) {
			this.emit(
				this.extendEventContext('voiceStreamingStop', args),
				newMember,
				newState.channel
			);
		}
	}
}
