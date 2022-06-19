import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { BaseContorller } from '../common/base.controller';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IDbController } from './database.controller.interface';
import ItemsModel from './db_config/db.model';
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
		if (!req.body.name || !req.body.cost || !req.body.amount) {
			res.json({
				eMsg: 'You must fill all fields',
			});
			return;
		}
		await ItemsModel.create({
			name: req.body.name,
			cost: req.body.cost,
			amount: req.body.amount,
		})
			.then((result) => {
				res.json({
					name: result.name,
					cost: result.cost,
					amount: result.amount,
					_id: result._id,
				});
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
			});
	}

	async read(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount) {
			res.json({
				eMsg: 'Cant find any document, enter at least 1 key to find',
			});
			return;
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

		await query
			.exec()
			.then((result) => {
				if (result.length == 0) {
					res.json({
						eMsg: 'We found nothing, try again',
					});
				} else {
					res.render('front.read-result.ejs', {
						title: 'Read',
						result: result,
					});
				}
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
			});
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

		await query
			.exec()
			.then((result: any) => {
				if (result.modifiedCount == 0) {
					res.json({
						eMsg: 'Nothing was updated',
					});
				} else {
					res.json(result);
				}
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
			});
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (!req.body?.name && !req.body?.cost && !req.body?.amount && !req.body?._id) {
			res.json({
				eMsg: 'Cant find any document to delete, enter at least 1 key to find',
			});
			return;
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
		if (req.body?._id) {
			query.where('_id').equals(req.body?._id);
		}

		await query
			.deleteMany()
			.exec()
			.then((result) => {
				if (result.deletedCount == 0) {
					res.json({
						eMsg: 'Nothing was deleted',
					});
				} else {
					res.json(result);
				}
			})
			.catch((error: Error) => {
				res.json({
					err: error.message,
				});
			});
	}

	createData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.create.ejs', { title: 'Create' });
	}

	readData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.read.ejs', { title: 'Read' });
	}

	updateData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.update.ejs', {
			title: 'Update',
			name: req.body?.name,
			cost: req.body?.cost,
			amount: req.body?.amount,
		});
	}

	deleteData(req: Request, res: Response, next: NextFunction): void {
		res.render('front.delete.ejs', { title: 'Delete' });
	}

	async items(req: Request, res: Response): Promise<void> {
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
		await query
			.exec()
			.then((result) => {
				res.render('front.items.ejs', {
					title: 'Items',
					name: result[0].name,
					cost: result[0].cost,
					amount: result[0].amount,
					_id: result[0]._id,
				});
			})
			.catch((error: Error) => {
				throw error;
			});
	}
}
