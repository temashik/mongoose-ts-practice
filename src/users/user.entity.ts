import { hash, compare } from 'bcryptjs';
import { IId } from '../db/db_config/db.model';

export class User {
	private _password: string;
	constructor(
		private readonly _name: string,
		private readonly _email: string,
		private readonly _possibilities: number,
		passwordHash?: string,
		private readonly __id?: IId | undefined,
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

	get possibilities(): number {
		return this._possibilities;
	}

	get password(): string {
		return this._password;
	}

	get _id(): IId | undefined {
		return this.__id;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async comparePassword(pass: string): Promise<boolean> {
		return compare(pass, this._password);
	}
}
