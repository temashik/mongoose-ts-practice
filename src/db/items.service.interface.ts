import { ItemDto } from './dto/item.dto';
import { Items } from './item.entity';
import { ItemUpdateDto } from './dto/item.update.dto';
import { ItemDeleteDto } from './dto/item.delete.dto';

export interface IItemsService {
	createItems: (dto: ItemDto, user: any) => Promise<Items | null>;
	findItems: (dto: ItemDto) => Promise<Array<Items> | null>;
	updateItems: (dto: ItemUpdateDto, user: any) => Promise<Array<Items> | null>;
	deleteItem: (dto: ItemDeleteDto, user: any) => Promise<boolean>;
	getItem: (url: any) => Promise<Items>;
}
