import { IId } from '../db_config/db.model';

export class ItemDeleteDto {
	name: string;
	cost: number;
	amount: number;
	_id: IId;
}
