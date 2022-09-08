import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseContorller } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IDbController } from './database.controller.interface';
import url from 'url';
import { IItemsService } from './items.service.interface';

@injectable()
export class DatabaseController extends BaseContorller implements IDbController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.ItemsService) private itemsService: IItemsService,
	) {
		super(loggerService);
		this.bindRoutes([
			{ path: '/create-result', method: 'post', func: this.create },
			{ path: '/read-result', method: 'post', func: this.read },
			{ path: '/update-result', method: 'post', func: this.update },
			{ path: '/delete-result', method: 'post', func: this.delete },
			{ path: '/create', method: 'get', func: this.createData },
			{ path: '/read', method: 'get', func: this.readData },
			{ path: '/update', method: 'post', func: this.updateData },
			{ path: '/update', method: 'get', func: this.updateData },
			{ path: '/delete', method: 'get', func: this.deleteData },
			{ path: '/items', method: 'get', func: this.items },
		]);
	}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body.name || !req.body.cost || !req.body.amount) {
			res.json({
				eMsg: 'You must fill all fields',
			});
			return;
		}
		const createdItem = await this.itemsService.createItems(req.body, req.cookies.login);
		if (!createdItem) {
			res.json({
				eMsg: 'Item with same name already exist',
			});
		} else {
			res.json({
				_id: createdItem._id,
			});
		}
	}

	async read(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount) {
			res.json({
				eMsg: 'Cant find any document, enter at least 1 key to find',
			});
			return;
		}
		const findedItems = await this.itemsService.findItems(req.body);
		if (!findedItems) {
			res.json({
				eMsg: 'We found nothing, try again',
			});
		} else {
			res.render('front.read-result.ejs', {
				title: 'Read',
				result: findedItems,
			});
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount) {
			res.json({
				eMsg: 'What you want to change?',
			});
			return;
		}
		if (!req.body?.newName && !req.body?.newCost && !req.body?.newAmount) {
			res.json({
				eMsg: 'What change you want to do?',
			});
			return;
		}
		const updatedItems = await this.itemsService.updateItems(req.body, req.cookies.login);
		if (!updatedItems) {
			res.json({
				eMsg: 'Nothing was updated',
			});
		} else {
			res.render('front.read-result.ejs', {
				title: 'Updating result',
				result: updatedItems,
			});
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount && !req.body?._id) {
			res.json({
				eMsg: 'Cant find any document to delete, enter at least 1 key to find',
			});
			return;
		}
		const isDeleted = await this.itemsService.deleteItem(req.body, req.cookies.login);
		if (!isDeleted) {
			res.json({
				eMsg: 'Nothing was deleted',
			});
		} else {
			res.json({
				msg: 'Document was successfully deleted',
			});
		}
	}

	createData(req: Request, res: Response, next: NextFunction): void {
		if (!req.cookies.login) {
			res.redirect(`/?eMsg=You are not authorized`);
		} else {
			res.render('front.create.ejs', { title: 'Create' });
		}
	}

	readData(req: Request, res: Response, next: NextFunction): void {
		if (!req.cookies.login) {
			res.redirect(`/?eMsg=You are not authorized`);
		} else {
			res.render('front.read.ejs', { title: 'Read' });
		}
	}

	updateData(req: Request, res: Response, next: NextFunction): void {
		if (!req.cookies.login) {
			res.redirect(`/?eMsg=You are not authorized`);
		} else {
			res.render('front.update.ejs', {
				title: 'Update',
				name: req.body?.name,
				cost: req.body?.cost,
				amount: req.body?.amount,
			});
		}
	}

	deleteData(req: Request, res: Response, next: NextFunction): void {
		if (!req.cookies.login) {
			res.redirect(`/?eMsg=You are not authorized`);
		} else {
			res.render('front.delete.ejs', { title: 'Delete' });
		}
	}

	async items(req: Request, res: Response): Promise<void> {
		const queryObject = url.parse(req.url, true).query;
		const item = await this.itemsService.getItem(queryObject);
		res.render('front.items.ejs', {
			title: 'Items',
			name: item.name,
			cost: item.cost,
			amount: item.amount,
			_id: item._id,
		});
	}
}
