import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { Guild, GuildFeature, GuildPremiumTier, VoiceChannel } from 'discord.js';

export type CustomGuildUpdateEvents = {
	guildBoostLevelUp: [
		guild: Guild,
		oldPremiumTier: GuildPremiumTier,
		newPremiumTier: GuildPremiumTier
	];
	guildBoostLevelDown: [oldGuild: Guild, newGuild: Guild];
	guildBannerAdd: [guild: Guild, bannerURL: string];
	guildAfkChannelAdd: [guild: Guild, afkChannel: VoiceChannel];
	guildVanityURLAdd: [guild: Guild, vanityURLCode: string];
	guildVanityURLUpdate: [guild: Guild, oldVanityURLCode: string, newVanityURLCode: string];
	guildVanityURLRemove: [guild: Guild, vanityURLCode: string];
	guildFeaturesUpdate: [
		guild: Guild,
		oldFeatures: `${GuildFeature}`[],
		newFeatures: `${GuildFeature}`[]
	];
	guildAcronymUpdate: [oldGuild: Guild, newGuild: Guild];
	guildOwnerUpdate: [oldGuild: Guild, newGuild: Guild];
	guildPartnerAdd: [guild: Guild];
	guildPartnerRemove: [guild: Guild];
	guildVerificationAdd: [guild: Guild];
	guildVerificationRemove: [guild: Guild];
};

@Injectable()
@CustomListener('guildUpdate')
export class GuildUpdateHandler extends BaseHandler<CustomGuildUpdateEvents> {
	@CustomListenerHandler()
	public handleGuildBoostLevel(...args: ContextOf<'guildUpdate'>) {
		const [oldGuild, newGuild] = args;

		if (oldGuild.premiumTier < newGuild.premiumTier) {
			this.emit(
				this.extendEventContext('guildBoostLevelUp', args),
				newGuild,
				oldGuild.premiumTier,
				newGuild.premiumTier
			);
		}

		if (oldGuild.premiumTier > newGuild.premiumTier) {
			this.emit(this.extendEventContext('guildBoostLevelDown', args), oldGuild, newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildVanityURL(...args: ContextOf<'guildUpdate'>) {
		const [oldGuild, newGuild] = args;

		if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
			this.emit(
				this.extendEventContext('guildVanityURLAdd', args),
				newGuild,
				newGuild.vanityURLCode
			);
		}

		if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
			this.emit(
				this.extendEventContext('guildVanityURLUpdate', args),
				newGuild,
				oldGuild.vanityURLCode,
				newGuild.vanityURLCode
			);
		}

		if (oldGuild.vanityURLCode && !newGuild.vanityURLCode) {
			this.emit(
				this.extendEventContext('guildVanityURLRemove', args),
				newGuild,
				oldGuild.vanityURLCode
			);
		}
	}

	@CustomListenerHandler()
	public handleGuildPartnered(...args: ContextOf<'guildUpdate'>) {
		const [oldGuild, newGuild] = args;

		if (!oldGuild.partnered && newGuild.partnered) {
			this.emit(this.extendEventContext('guildPartnerAdd', args), newGuild);
		}

		if (oldGuild.partnered && !newGuild.partnered) {
			this.emit(this.extendEventContext('guildPartnerRemove', args), newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildVerification(...args: ContextOf<'guildUpdate'>) {
		const [oldGuild, newGuild] = args;

		if (!oldGuild.verified && newGuild.verified) {
			this.emit(this.extendEventContext('guildVerificationAdd', args), newGuild);
		}

		if (oldGuild.verified && !newGuild.verified) {
			this.emit(this.extendEventContext('guildVerificationRemove', args), newGuild);
		}
	}

	@CustomListenerHandler()
	public handleGuildChanges(...args: ContextOf<'guildUpdate'>) {
		const [oldGuild, newGuild] = args;

		if (!oldGuild.banner && newGuild.banner) {
			this.emit(
				this.extendEventContext('guildBannerAdd', args),
				newGuild,
				newGuild.bannerURL()
			);
		}

		if (!oldGuild.afkChannel && newGuild.afkChannel) {
			this.emit(
				this.extendEventContext('guildAfkChannelAdd', args),
				newGuild,
				newGuild.afkChannel
			);
		}

		if (oldGuild.features.length !== newGuild.features.length) {
			this.emit(
				this.extendEventContext('guildFeaturesUpdate', args),
				newGuild,
				oldGuild.features,
				newGuild.features
			);
		}

		if (oldGuild.nameAcronym !== newGuild.nameAcronym) {
			this.emit(this.extendEventContext('guildAcronymUpdate', args), oldGuild, newGuild);
		}

		if (oldGuild.ownerId !== newGuild.ownerId) {
			this.emit(this.extendEventContext('guildOwnerUpdate', args), oldGuild, newGuild);
		}
	}
}
