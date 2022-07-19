import { hash, compare } from 'bcryptjs';
import { IId } from '../db/db_config/db.model';

export class User {
	private _password: string;
	constructor(
		private readonly _name: string,
		private readonly _email: string,
		private readonly _possibilities?: number | undefined,
		passwordHash?: string,
		private readonly __id?: IId | undefined,
		private readonly _oauth2Id?: string,
		private readonly _oauth2Type?: string,
	) {
		if (passwordHash) {
			this._password = passwordHash;
		}
	}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get possibilities(): number | undefined {
		return this._possibilities;
	}

	get password(): string {
		return this._password;
	}

	get _id(): IId | undefined {
		return this.__id;
	}

	get oauth2Id(): string | undefined {
		return this._oauth2Id;
	}
	get oauth2Type(): string | undefined {
		return this._oauth2Type;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
