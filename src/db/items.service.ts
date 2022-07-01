import { ItemDto } from './dto/item.dto';
import { Items } from './item.entity';
import { IItemsService } from './items.service.interface';
import ItemsModel from './db_config/db.model';
import { injectable } from 'inversify';
import { ItemUpdateDto } from './dto/item.update.dto';
import { ItemDeleteDto } from './dto/item.delete.dto';

@injectable()
export class ItemsService implements IItemsService {
	async createItems({ name, cost, amount }: ItemDto, user: any): Promise<Items | null> {
		const newItem = new Items(name, cost, amount, user);
		const findResult = await ItemsModel.findOne({ name: newItem.name });
		if (findResult) {
			return null;
		}
		const result = await ItemsModel.create({
			name: newItem.name,
			cost: newItem.cost,
			amount: newItem.amount,
			user: newItem.user,
		});
		return new Items(result.name, result.cost, result.amount, result.user, result._id);
	}

	async findItems({ name, cost, amount }: ItemDto): Promise<Array<Items> | null> {
		const newItem = new Items(name, cost, amount);
		const query = ItemsModel.find();
		if (newItem?.name) {
			query.where('name').equals(newItem?.name);
		}
		if (newItem?.cost) {
			query.where('cost').equals(newItem?.cost);
		}
		if (newItem?.amount) {
			query.where('amount').equals(newItem?.amount);
		}

		const result = await query.exec();
		let items: Array<Items>;
		if (result.length == 0) {
			return null;
		} else {
			items = result.map((item) => {
				return new Items(item.name, item.cost, item.amount, item.user, item._id);
			});
			return items;
		}
	}

	async updateItems(
		{ name, cost, amount, newName, newCost, newAmount }: ItemUpdateDto,
		user: any,
	): Promise<Array<Items> | null> {
		const newItem = new Items(name, cost, amount);
		const validRoot = ItemsModel.findOne();
		if (newItem?.name) {
			validRoot.where('name').equals(newItem?.name);
		}
		if (newItem?.cost) {
			validRoot.where('cost').equals(newItem?.cost);
		}
		if (newItem?.amount) {
			validRoot.where('amount').equals(newItem?.amount);
		}

		const verify = await validRoot.exec();
		if (!verify || verify.user != user) {
			return null;
		}

		const oldValue = new Items(name, cost, amount);
		const newValue = new Items(newName, newCost, newAmount);
		const query = ItemsModel.where();
		if (oldValue?.name) {
			query.where('name').equals(oldValue?.name);
		}
		if (oldValue?.cost) {
			query.where('cost').equals(oldValue?.cost);
		}
		if (oldValue?.amount) {
			query.where('amount').equals(oldValue?.amount);
		}

		if (newValue?.name) {
			query.updateMany({ name: newValue?.name });
		}

		if (newValue?.amount) {
			query.updateMany({ amount: newValue?.amount });
		}

		if (newValue?.cost) {
			query.updateMany({ cost: newValue?.cost });
		}

		const result: any = await query.exec();
		if (result.modifiedCount == 0) {
			return null;
		} else {
			const data = {
				name: newValue.name as string,
				cost: newValue.cost as number,
				amount: newValue.amount as number,
			};
			const res = await this.findItems(data);
			return res;
		}
	}

	async deleteItem({ name, cost, amount, _id }: ItemDeleteDto, user: any): Promise<boolean> {
		const validItem = new Items(name, cost, amount, undefined, _id);
		const validRoot = ItemsModel.findOne();
		//TODO: нейминг, убрать ненужный инстанс Items
		if (validItem?.name) {
			validRoot.where('name').equals(validItem?.name);
		}
		if (validItem?.cost) {
			validRoot.where('cost').equals(validItem?.cost);
		}
		if (validItem?.amount) {
			validRoot.where('amount').equals(validItem?.amount);
		}
		if (validItem?._id) {
			validRoot.where('_id').equals(validItem?._id);
		}

		const verify = await validRoot.exec();
		if (!verify || verify.user != user) {
			return false;
		}
		const newItem = new Items(name, cost, amount, undefined, _id);
		const query = ItemsModel.where();
		if (newItem?.name) {
			query.where('name').equals(newItem?.name);
		}
		if (newItem?.cost) {
			query.where('cost').equals(newItem?.cost);
		}
		if (newItem?.amount) {
			query.where('amount').equals(newItem?.amount);
		}
		if (newItem?._id) {
			query.where('_id').equals(newItem?._id);
		}

		const result = await query.deleteOne().exec();
		if (result.deletedCount == 0) {
			return false;
		} else {
			return true;
		}
	}

	async getItem({ name, cost, amount, _id }: any): Promise<Items> {
		const query = ItemsModel.findOne();
		if (name) {
			query.where('name').equals(name);
		}
		if (cost) {
			query.where('cost').equals(cost);
		}
		if (amount) {
			query.where('amount').equals(amount);
		}
		if (_id) {
			query.where('_id').equals(_id);
		}
		const item = await query.exec();
		if (!item) {
			return new Items();
		}
		return new Items(item.name, item.cost, item.amount, item.user, item._id);
	}
}
