import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseContorller } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IDbController } from './database.controller.interface';
import ItemsModel, { IItems } from './db_config/db.model';
import url from 'url';

@injectable()
export class DatabaseController extends BaseContorller implements IDbController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
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
		ItemsModel.create({
			name: req.body.name,
			cost: req.body.cost,
			amount: req.body.amount,
		})
			.then((result) => {
				res.render('front.create-result.pug', {
					title: 'Create',
					name: result.name,
					cost: result.cost,
					amount: result.amount,
				});
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	read(req: Request, res: Response, next: NextFunction): void {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount) {
			this.loggerService.warn('No args for search');
		}
		const query = ItemsModel.find();
		if (req.body?.name) {
			query.where('name').equals(req.body?.name);
		}
		if (req.body?.cost) {
			query.where('cost').equals(req.body?.cost);
		}
		if (req.body?.amount) {
			query.where('amount').equals(req.body?.amount);
		}

		query
			.exec()
			.then((result) => {
				res.render('front.read-result.pug', {
					title: 'Read',
					result: result,
				});
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	update(req: Request, res: Response, next: NextFunction): void {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount) {
			this.loggerService.warn('What you want to change?');
		}
		if (!req.body?.newName && !req.body?.newCost && !req.body?.newAmount) {
			this.loggerService.warn('What change you want to do?');
		}

		const query = ItemsModel.where();
		if (req.body?.name) {
			query.where('name').equals(req.body?.name);
		}
		if (req.body?.cost) {
			query.where('cost').equals(req.body?.cost);
		}
		if (req.body?.amount) {
			query.where('amount').equals(req.body?.amount);
		}

		if (req.body?.newName != '') {
			query.updateMany({ name: req.body?.newName });
		}

		if (req.body?.newAmount != '') {
			query.updateMany({ amount: req.body?.newAmount });
		}

		if (req.body?.newCost != '') {
			query.updateMany({ cost: req.body?.newCost });
		}

		query
			//.updateMany({ name: req.body?.newName, cost: req.body?.newCost, amount: req.body?.newAmount })
			.exec()
			.then((result) => {
				res.json(result);
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	delete(req: Request, res: Response, next: NextFunction): void {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount && !req.body?.id) {
			this.loggerService.warn('Cant find document to delete');
		}
		const query = ItemsModel.where();
		if (req.body?.name) {
			query.where('name').equals(req.body?.name);
		}
		if (req.body?.cost) {
			query.where('cost').equals(req.body?.cost);
		}
		if (req.body?.amount) {
			query.where('amount').equals(req.body?.amount);
		}
		if (req.body?.id) {
			query.where('_id').equals(req.body?.id);
		}

		query
			.deleteMany()
			.exec()
			.then((result) => {
				res.json(result);
			})
			.catch((error: Error) => {
				throw error;
			});
	}

	createData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.create.pug', { title: 'Create' });
	}

	readData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.read.pug', { title: 'Read' });
	}

	updateData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.update.pug', {
			title: 'Update',
			name: req.body?.name,
			cost: req.body?.cost,
			amount: req.body?.amount,
		});
	}

	deleteData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.delete.pug', { title: 'Delete' });
	}

	items(req: Request, res: Response): void {
		const queryObject = url.parse(req.url, true).query;
		const query = ItemsModel.find();
		if (queryObject?.name) {
			query.where('name').equals(queryObject?.name);
		}
		if (queryObject?.cost) {
			query.where('cost').equals(queryObject?.cost);
		}
		if (queryObject?.amount) {
			query.where('amount').equals(queryObject?.amount);
		}
		if (queryObject?._id) {
			query.where('_id').equals(queryObject?._id);
		}
		query
			.exec()
			.then((result) => {
				res.render('front.items.pug', {
					title: 'Items',
					name: result[0].name,
					cost: result[0].cost,
					amount: result[0].amount,
					id: result[0]._id,
				});
			})
			.catch((error: Error) => {
				throw error;
			});
	}
}
