import { BaseHandler } from './base.handler';
import { Injectable } from '@nestjs/common';
import { CustomListener, CustomListenerHandler } from '../decorators';
import { ContextOf } from '../../context';
import { PermissionsBitField, Role } from 'discord.js';

export type CustomRoleUpdateEvents = {
	rolePositionUpdate: [role: Role, oldPosition: number, newPosition: number];
	rolePermissionsUpdate: [
		role: Role,
		oldPermissions: Readonly<PermissionsBitField>,
		newPermissions: Readonly<PermissionsBitField>
	];
	roleIconAdd: [role: Role, iconURL: string];
	roleIconUpdate: [role: Role, oldIconURL: string, newIconURL: string];
	roleIconRemove: [role: Role, iconURL: string];
};

@Injectable()
@CustomListener('roleUpdate')
export class RoleUpdateHandler extends BaseHandler<CustomRoleUpdateEvents> {
	@CustomListenerHandler()
	public handleRolePositionUpdate(...args: ContextOf<'roleUpdate'>) {
		const [oldRole, newRole] = args;

		if (oldRole.rawPosition !== newRole.rawPosition) {
			this.emit(
				'rolePositionUpdate',
				args,
				newRole,
				oldRole.rawPosition,
				newRole.rawPosition
			);
		}
	}

	@CustomListenerHandler()
	public handleRolePermissionsUpdate(...args: ContextOf<'roleUpdate'>) {
		const [oldRole, newRole] = args;

		if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
			this.emit(
				'rolePermissionsUpdate',
				args,
				newRole,
				oldRole.permissions,
				newRole.permissions
			);
		}
	}

	@CustomListenerHandler()
	public handleRoleIconChanges(...args: ContextOf<'roleUpdate'>) {
		const [oldRole, newRole] = args;

		if (!oldRole.icon && newRole.icon) {
			this.emit('roleIconAdd', args, newRole, newRole.iconURL());
		}

		if (oldRole.icon !== newRole.icon) {
			this.emit('roleIconUpdate', args, newRole, oldRole.iconURL(), newRole.iconURL());
		}

		if (oldRole.icon && !newRole.icon) {
			this.emit('roleIconRemove', args, newRole, oldRole.iconURL());
		}
	}
}
