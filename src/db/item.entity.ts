import { IId } from './db_config/db.model';

export class Items {
	constructor(
		private readonly _name?: string | undefined,
		private readonly _cost?: number | undefined,
		private readonly _amount?: number | undefined,
		private readonly _user?: IId | undefined,
		private readonly __id?: IId | undefined,
	) {}

	get name(): string | undefined {
		return this._name;
	}

	get cost(): number | undefined {
		return this._cost;
	}

	get amount(): number | undefined {
		return this._amount;
	}

	get user(): IId | undefined {
		return this._user;
	}

	get _id(): IId | undefined {
		return this.__id;
	}
}
